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
use Illuminate\Support\Facades\Cache;
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
        $lesson = null;

        try {
            Log::info("بدء معالجة الفيديو للدرس: {$this->lesson->id}");

            // التحقق من وجود الدرس في قاعدة البيانات
            $lesson = Lesson::where('id', $this->lesson->id)->firstOrFail();

            // التحقق من وجود مسار الفيديو
            if (empty($lesson->video_path)) {
                throw new \Exception("مسار الفيديو فارغ");
            }

            $videoPath = storage_path('app/' . $lesson->video_path);
            $outputDir = storage_path("app/private_videos/hls/lesson_{$lesson->id}");

            // التحقق من صحة الملف
            $this->validateVideoFile($videoPath);

            // التحقق من توفر FFmpeg
            $this->checkFFmpegAvailability();

            // إنشاء المجلدات المطلوبة
            $this->createDirectories($outputDir);

            // تحديث حالة المعالجة وحفظ وقت البداية
            $lesson->update(['video_status' => 'processing']);
            Cache::put("video_processing_started_{$lesson->id}", time(), 3600); // حفظ لساعة

            // توليد مفاتيح التشفير
            $keyData = $this->generateEncryptionKeys($outputDir);

            // معالجة الفيديو باستخدام FFmpeg مع التشفير
            $this->processVideoWithFFmpeg($videoPath, $outputDir, $keyData);

            // التحقق من نجاح المعالجة
            $this->verifyProcessing($outputDir);

            // الحصول على معلومات الفيديو
            $videoInfo = $this->getVideoInfo($videoPath);

            // تحديث بيانات الدرس
            $lesson->update([
                'video_status' => 'ready',
                'video_duration' => $videoInfo['duration'] ?? null,
                'video_size' => $videoInfo['size'] ?? null,
            ]);

            // حذف الملف المؤقت
            if (Storage::exists($lesson->video_path)) {
                Storage::delete($lesson->video_path);
                $lesson->update(['video_path' => "private_videos/hls/lesson_{$lesson->id}/index.m3u8"]);
            }

            Log::info("تمت معالجة الفيديو بنجاح للدرس: {$lesson->id}");

        } catch (\Exception $e) {
            Log::error("خطأ في معالجة الفيديو للدرس: {$this->lesson->id}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // تحديث حالة الدرس في قاعدة البيانات
            if ($lesson) {
                $lesson->update(['video_status' => 'failed']);
            }

            throw $e;
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
        try {
            $lesson = Lesson::where('id', $this->lesson->id)->first();
            if ($lesson) {
                $lesson->update(['video_status' => 'failed']);
            }
        } catch (\Exception $e) {
            Log::error("لا يمكن تحديث حالة الدرس {$this->lesson->id}: " . $e->getMessage());
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
     * التحقق من صحة ملف الفيديو
     */
    private function validateVideoFile(string $videoPath): void
    {
        if (!file_exists($videoPath)) {
            throw new \Exception("ملف الفيديو غير موجود: {$videoPath}");
        }

        if (filesize($videoPath) == 0) {
            throw new \Exception("ملف الفيديو فارغ: {$videoPath}");
        }

        // التحقق من نوع الملف
        $mimeType = mime_content_type($videoPath);
        $allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm'];

        if (!in_array($mimeType, $allowedTypes)) {
            throw new \Exception("نوع الملف غير مدعوم: {$mimeType}");
        }

        Log::info("تم التحقق من صحة ملف الفيديو: {$videoPath} - الحجم: " . $this->formatBytes(filesize($videoPath)));
    }

    /**
     * التحقق من توفر FFmpeg
     */
    private function checkFFmpegAvailability(): void
    {
        $process = new Process(['ffmpeg', '-version']);
        $process->setTimeout(10);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new \Exception("FFmpeg غير متوفر في النظام. يرجى تثبيته أولاً.");
        }

        Log::info("FFmpeg متوفر: " . trim(explode("\n", $process->getOutput())[0]));
    }

    /**
     * الحصول على معلومات الفيديو
     */
    private function getVideoInfo(string $videoPath): array
    {
        $command = [
            'ffprobe',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            '-show_streams',
            $videoPath
        ];

        $process = new Process($command);
        $process->setTimeout(30);
        $process->run();

        if (!$process->isSuccessful()) {
            Log::warning("لا يمكن الحصول على معلومات الفيديو: " . $process->getErrorOutput());
            return ['duration' => null, 'size' => filesize($videoPath)];
        }

        $data = json_decode($process->getOutput(), true);
        $duration = null;

        // البحث عن مدة الفيديو
        if (isset($data['format']['duration'])) {
            $duration = (int) round(floatval($data['format']['duration']));
        } elseif (isset($data['streams'])) {
            foreach ($data['streams'] as $stream) {
                if ($stream['codec_type'] === 'video' && isset($stream['duration'])) {
                    $duration = (int) round(floatval($stream['duration']));
                    break;
                }
            }
        }

        return [
            'duration' => $duration,
            'size' => filesize($videoPath)
        ];
    }

    /**
     * تنسيق الحجم بالبايت
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        return round($bytes, 2) . ' ' . $units[$i];
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

        // أوامر FFmpeg محسنة ومتوازنة للأداء والجودة
        $command = [
            'ffmpeg',
            '-i', $inputPath,

            // إعدادات الفيديو - محسنة للجودة والحجم
            '-c:v', 'libx264',
            '-preset', 'medium', // توازن بين الجودة والسرعة
            '-crf', '23', // جودة عالية
            '-maxrate', '2M', // معدل نقل مناسب
            '-bufsize', '4M',
            '-vf', 'scale=-2:720', // دقة HD مناسبة

            // إعدادات الصوت
            '-c:a', 'aac',
            '-b:a', '128k', // جودة صوت جيدة
            '-ar', '44100',

            // إعدادات HLS
            '-f', 'hls',
            '-hls_time', '6', // مقاطع أقصر للتدفق السلس
            '-hls_list_size', '0',
            '-hls_segment_filename', "{$outputDir}/segment_%03d.ts",

            // إعدادات التشفير
            '-hls_key_info_file', $keyData['key_info_file'],
            '-hls_flags', 'independent_segments',

            // ملف الإخراج
            $outputFile,

            // إعدادات إضافية للأداء
            '-threads', '0', // استخدام جميع الـ cores المتاحة
            '-movflags', '+faststart',
            '-loglevel', 'warning',
            '-y'
        ];

        $process = new Process($command);
        $process->setTimeout(3600); // ساعة كاملة للملفات الكبيرة

        Log::info("بدء معالجة FFmpeg للدرس {$this->lesson->id}");

        $startTime = microtime(true);
        $lastUpdate = $startTime;

        $process->run(function ($type, $buffer) use (&$lastUpdate) {
            $now = microtime(true);
            if ($now - $lastUpdate > 30) { // تحديث كل 30 ثانية
                Log::info("معالجة FFmpeg مستمرة للدرس {$this->lesson->id}...");
                $lastUpdate = $now;
            }
        });

        $processingTime = round(microtime(true) - $startTime, 2);

        if (!$process->isSuccessful()) {
            $error = $process->getErrorOutput();
            Log::error("فشل في معالجة الفيديو للدرس {$this->lesson->id}", [
                'error_output' => $error,
                'exit_code' => $process->getExitCode(),
                'processing_time' => $processingTime
            ]);
            throw new ProcessFailedException($process);
        }

        Log::info("انتهت معالجة FFmpeg بنجاح للدرس {$this->lesson->id} في {$processingTime} ثانية");
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
