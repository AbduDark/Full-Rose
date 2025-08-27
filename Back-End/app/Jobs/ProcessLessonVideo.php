<?php

namespace App\Jobs;

use App\Models\Lesson;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ProcessLessonVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $lesson;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * The maximum number of seconds the job should run.
     *
     * @var int
     */
    public $timeout = 1800; // 30 minutes

    /**
     * Create a new job instance.
     */
    public function __construct(Lesson $lesson)
    {
        $this->lesson = $lesson;
        $this->onQueue('video-processing');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("بدء معالجة الفيديو للدرس: {$this->lesson->id}");

            // التحقق من وجود الدرس في قاعدة البيانات
            $lesson = Lesson::find($this->lesson->id);
            if (!$lesson) {
                Log::error("الدرس غير موجود: {$this->lesson->id}");
                $this->fail(new \Exception("الدرس غير موجود"));
                return;
            }

            // التحقق من وجود مسار الفيديو
            if (empty($lesson->video_path)) {
                Log::error("مسار الفيديو فارغ للدرس: {$lesson->id}");
                $lesson->update(['video_status' => 'failed']);
                $this->fail(new \Exception("مسار الفيديو فارغ"));
                return;
            }

            $videoPath = storage_path('app/' . $lesson->video_path);
            $outputDir = storage_path("app/private_videos/hls/lesson_{$lesson->id}");

            if (!file_exists($videoPath)) {
                Log::error("ملف الفيديو غير موجود: {$videoPath}");
                $lesson->update(['video_status' => 'failed']);
                $this->fail(new \Exception("ملف الفيديو غير موجود"));
                return;
            }

            // التحقق من حجم الملف
            if (filesize($videoPath) == 0) {
                Log::error("ملف الفيديو فارغ: {$videoPath}");
                $lesson->update(['video_status' => 'failed']);
                $this->fail(new \Exception("ملف الفيديو فارغ"));
                return;
            }

            // Create output directory
            if (!is_dir($outputDir)) {
                if (!mkdir($outputDir, 0755, true)) {
                    Log::error("فشل في إنشاء مجلد الإخراج: {$outputDir}");
                    $lesson->update(['video_status' => 'failed']);
                    return;
                }
            }

            // التحقق من وجود FFmpeg
            $ffmpegCheck = exec('which ffmpeg 2>/dev/null');
            if (empty($ffmpegCheck)) {
                Log::error("FFmpeg غير مثبت على الخادم");
                $lesson->update(['video_status' => 'failed']);
                $this->fail(new \Exception("FFmpeg غير متوفر"));
                return;
            }

            // إنشاء مجلد الإخراج
            if (!is_dir($outputDir)) {
                if (!mkdir($outputDir, 0755, true)) {
                    Log::error("فشل في إنشاء مجلد الإخراج: {$outputDir}");
                    $lesson->update(['video_status' => 'failed']);
                    $this->fail(new \Exception("فشل في إنشاء مجلد الإخراج"));
                    return;
                }
            }

            // تحديث حالة المعالجة
            $lesson->update(['video_status' => 'processing']);

            // Generate HLS segments using FFmpeg with better error handling
            $command = "timeout 1800 ffmpeg -i " . escapeshellarg($videoPath) . " " .
                      "-c:v libx264 -preset fast -crf 23 " .
                      "-c:a aac -b:a 128k " .
                      "-hls_time 10 -hls_list_size 0 -hls_segment_filename " .
                      escapeshellarg($outputDir . "/segment_%03d.ts") . " " .
                      "-f hls " . escapeshellarg($outputDir . "/index.m3u8") . " 2>&1";

            Log::info("تشغيل أمر FFmpeg للدرس: {$lesson->id}");
            Log::info("الأمر: {$command}");

            $output = [];
            $returnCode = 0;
            exec($command, $output, $returnCode);

            if ($returnCode === 0 && file_exists($outputDir . '/index.m3u8')) {
                // Generate encryption key
                $encryptionKey = base64_encode(random_bytes(16));

                // Save key to secure location
                $keyPath = $outputDir . '/encryption.key';
                file_put_contents($keyPath, $encryptionKey);

                // Update lesson with processing status
                $lesson->update([
                    'video_status' => 'completed',
                    'video_encryption_key' => $encryptionKey,
                    'hls_path' => "private_videos/hls/lesson_{$lesson->id}/index.m3u8"
                ]);

                Log::info("تمت معالجة الفيديو بنجاح للدرس: {$lesson->id}");
            } else {
                Log::error("فشل في معالجة الفيديو للدرس: {$lesson->id}", [
                    'output' => implode("\n", $output),
                    'return_code' => $returnCode,
                    'command' => $command
                ]);

                $lesson->update(['video_status' => 'failed']);
                $this->fail(new \Exception('فشل في معالجة الفيديو: ' . implode("\n", $output)));
            }

        } catch (\Exception $e) {
            Log::error("خطأ في معالجة الفيديو للدرس: {$this->lesson->id}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // تحديث حالة الدرس في قاعدة البيانات
            if (isset($lesson)) {
                $lesson->update(['video_status' => 'failed']);
            }

            $this->fail($e);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("فشل نهائي في معالجة الفيديو للدرس: {$this->lesson->id}", [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);

        // تحديث حالة الدرس إلى فاشل
        $lesson = Lesson::find($this->lesson->id);
        if ($lesson) {
            $lesson->update(['video_status' => 'failed']);
        }

        // تنظيف الملفات المؤقتة
        $this->cleanup();
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     */
    public function retryAfter(): int
    {
        return 30; // انتظار 30 ثانية بين المحاولات
    }

    /**
     * التحقق من توفر FFmpeg
     */
    private function checkFFmpegAvailability(): void
    {
        $process = new Process(['ffmpeg', '-version']);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \Exception("FFmpeg غير متوفر في النظام. يرجى تثبيته أولاً.");
        }

        Log::info("FFmpeg متوفر: " . trim(explode("\n", $process->getOutput())[0]));
    }

    /**
     * إنشاء المجلدات المطلوبة
     */
    private function createDirectories(string $outputDir): void
    {
        if (!is_dir($outputDir)) {
            if (!mkdir($outputDir, 0755, true)) {
                throw new \Exception("فشل في إنشاء مجلد الإخراج: {$outputDir}");
            }
        }
    }

    /**
     * توليد مفاتيح التشفير AES-128
     */
    private function generateEncryptionKeys(string $outputDir): array
    {
        // توليد مفتاح عشوائي 16 بايت
        $key = random_bytes(16);
        $keyFile = "{$outputDir}/enc.key";

        if (file_put_contents($keyFile, $key) === false) {
            throw new \Exception("فشل في كتابة ملف المفتاح");
        }

        // توليد IV عشوائي
        $iv = bin2hex(random_bytes(16));

        // إنشاء ملف معلومات المفتاح
        $keyInfoFile = "{$outputDir}/enc.keyinfo";
        $keyUri = route('lesson.key', ['lesson' => $this->lesson->id]);

        $keyInfoContent = "{$keyUri}\n{$keyFile}\n{$iv}";

        if (file_put_contents($keyInfoFile, $keyInfoContent) === false) {
            throw new \Exception("فشل في كتابة ملف معلومات المفتاح");
        }

        return [
            'key_file' => $keyFile,
            'key_info_file' => $keyInfoFile,
            'iv' => $iv
        ];
    }

    /**
     * معالجة الفيديو باستخدام FFmpeg مع HLS والتشفير
     */
    private function processVideoWithFFmpeg(string $inputPath, string $outputDir, array $keyData): void
    {
        $outputFile = "{$outputDir}/index.m3u8";

        // أوامر FFmpeg محسنة للملفات الصغيرة
        $command = [
            'ffmpeg',
            '-i', $inputPath,

            // إعدادات الفيديو
            '-c:v', 'libx264',
            '-preset', 'fast', // أسرع في المعالجة
            '-crf', '28', // جودة مناسبة للملفات الصغيرة
            '-maxrate', '1M',
            '-bufsize', '2M',
            '-vf', 'scale=-2:480', // دقة أقل للملفات الصغيرة

            // إعدادات الصوت
            '-c:a', 'aac',
            '-b:a', '96k', // bitrate أقل للصوت
            '-ar', '44100',

            // إعدادات HLS
            '-f', 'hls',
            '-hls_time', '10', // مقاطع أطول لملفات أقل
            '-hls_list_size', '0',
            '-hls_segment_filename', "{$outputDir}/segment_%03d.ts",

            // إعدادات التشفير
            '-hls_key_info_file', $keyData['key_info_file'],
            '-hls_flags', 'delete_segments',

            // إعدادات إضافية للأمان
            '-hls_base_url', '',

            // ملف الإخراج
            $outputFile,

            // مخرجات مفصلة للتشخيص
            '-loglevel', 'info',
            '-y'
        ];

        $process = new Process($command);
        $process->setTimeout(1800); // 30 دقيقة للملفات الصغيرة

        Log::info("تشغيل أمر FFmpeg للدرس {$this->lesson->id}");
        Log::info("أمر FFmpeg: " . implode(' ', $command));

        $startTime = microtime(true);

        $process->run(function ($type, $buffer) {
            if ($type === Process::ERR) {
                Log::info("FFmpeg output: " . trim($buffer));
            }
        });

        $processingTime = round(microtime(true) - $startTime, 2);
        Log::info("مدة المعالجة: {$processingTime} ثانية");

        if (!$process->isSuccessful()) {
            $error = $process->getErrorOutput();
            $output = $process->getOutput();
            Log::error("فشل FFmpeg للدرس {$this->lesson->id}");
            Log::error("خطأ: " . $error);
            Log::error("المخرجات: " . $output);
            throw new ProcessFailedException($process);
        }

        Log::info("انتهت معالجة FFmpeg بنجاح للدرس {$this->lesson->id}");
    }

    /**
     * التحقق من نجاح المعالجة
     */
    private function verifyProcessing(string $outputDir): void
    {
        $playlistFile = "{$outputDir}/index.m3u8";

        if (!file_exists($playlistFile)) {
            throw new \Exception("لم يتم إنشاء ملف الـ playlist");
        }

        // التحقق من وجود ملفات segments
        $content = file_get_contents($playlistFile);
        if (empty($content)) {
            throw new \Exception("ملف الـ playlist فارغ");
        }

        // عد ملفات الـ segments
        $segmentCount = substr_count($content, '.ts');
        if ($segmentCount === 0) {
            throw new \Exception("لم يتم إنشاء أي مقاطع فيديو");
        }

        // التحقق من ملف المفتاح
        $keyFile = "{$outputDir}/enc.key";
        if (!file_exists($keyFile) || filesize($keyFile) !== 16) {
            throw new \Exception("ملف مفتاح التشفير غير صحيح");
        }

        Log::info("تم التحقق من صحة المعالجة للدرس {$this->lesson->id} - عدد المقاطع: {$segmentCount}");
    }

    /**
     * تنظيف الملفات في حالة الفشل
     */
    private function cleanup(): void
    {
        try {
            $outputDir = "private_videos/hls/lesson_{$this->lesson->id}";
            Storage::deleteDirectory($outputDir);
            Log::info("تم تنظيف الملفات للدرس {$this->lesson->id}");
        } catch (\Exception $e) {
            Log::error("خطأ في تنظيف الملفات للدرس {$this->lesson->id}: " . $e->getMessage());
        }
    }

    /**
     * إعادة المحاولة
     */
    public function retryUntil(): \DateTime
    {
        return now()->addHours(4);
    }
}