<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessLessonVideo;
use App\Models\Lesson;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LessonVideoController extends Controller
{
    use ApiResponseTrait;

    /**
     * رفع الفيديو وبدء معالجته
     */
    public function upload(Request $request, $lessonId)
    {
        try {
            // Validate video file
            $request->validate([
                'video' => 'required|file|mimes:mp4,mov,avi,wmv,webm|max:204800' // 200MB max
            ]);

            // التحقق من أن الملف ليس فارغ
            if ($request->file('video')->getSize() == 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'ملف الفيديو فارغ'
                ], 400);
            }

            $lesson = Lesson::findOrFail($lessonId);

            // التحقق من الصلاحيات (admin only)
            if (!$request->user()->isAdmin('admin')) {
                return $this->errorResponse('غير مصرح لك برفع الفيديوهات', 403);
            }

            // حذف الفيديو السابق إذا وجد
            if ($lesson->video_path) {
                $this->deleteOldVideo($lesson);
            }

            // رفع الفيديو الجديد
            $fileName = Str::uuid() . '.' . $request->video->getClientOriginalExtension();
            $tempPath = $request->video->storeAs('temp_videos', $fileName);

            // تحديث المسار المؤقت في قاعدة البيانات
            $lesson->update([
                'video_path' => $tempPath,
                'video_status' => 'processing'
            ]);

            // التحقق من عدم وجود job معالجة مسبقًا
            $existingJobs = \DB::table('jobs')
                ->where('payload', 'like', '%ProcessLessonVideo%')
                ->where('payload', 'like', '%"lesson_id":' . $lesson->id . '%')
                ->count();

            if ($existingJobs == 0) {
                // إضافة Job لمعالجة الفيديو
                ProcessLessonVideo::dispatch($lesson)->onQueue('video-processing');
                Log::info("تم إضافة job معالجة الفيديو للدرس: {$lesson->id}");
            } else {
                Log::info("يوجد job معالجة فيديو قيد التنفيذ للدرس: {$lesson->id}");
            }

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الفيديو بنجاح، وجاري معالجته...',
                'status' => 'processing',
                'upload_progress' => 100,
                'processing_progress' => 0,
                'status_url' => route('lesson.status', $lesson->id)
            ]);

        } catch (\Exception $e) {
            Log::error('Video upload error: ' . $e->getMessage());
            return $this->errorResponse('حدث خطأ أثناء رفع الفيديو', 500);
        }
    }

    /**
     * إرجاع playlist الـ HLS مع التحقق من الصلاحيات
     */
    public function getPlaylist(Request $request, Lesson $lesson)
    {
        try {
            /** @var User $user */
            $user = auth()->user();

            if (!$this->canAccessLesson($user, $lesson)) {
                abort(403, 'ليس لديك صلاحية لمشاهدة هذا الدرس');
            }

            $playlistPath = storage_path("app/private_videos/hls/lesson_{$lesson->id}/index.m3u8");

            if (!file_exists($playlistPath)) {
                abort(404, 'الفيديو غير متوفر حالياً');
            }

            // قراءة محتوى الـ playlist وتعديل مسارات الـ segments
            $content = file_get_contents($playlistPath);
            $content = $this->modifyPlaylistUrls($content, $lesson->id);

            return response($content)
                ->header('Content-Type', 'application/vnd.apple.mpegurl')
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');

        } catch (\Exception $e) {
            Log::error('Playlist access error: ' . $e->getMessage());
            abort(500, 'خطأ في الخادم');
        }
    }

    /**
     * إرجاع segment معين مع token قصير العمر
     */
    public function getSegment(Request $request, $lessonId, $segment)
    {
        try {
            $lesson = Lesson::findOrFail($lessonId);
            $user = auth()->user();

            if (!$this->canAccessLesson($user, $lesson)) {
                abort(403, 'غير مصرح');
            }

            // التحقق من صحة الـ token
            $token = $request->get('token');
            if (!$this->validateSegmentToken($token, $lessonId, $segment)) {
                abort(403, 'رابط منتهي الصلاحية');
            }

            $segmentPath = storage_path("app/private_videos/hls/lesson_{$lessonId}/{$segment}");

            if (!file_exists($segmentPath)) {
                abort(404, 'الملف غير موجود');
            }

            return response()->file($segmentPath, [
                'Content-Type' => 'video/mp2t',
                'Cache-Control' => 'private, max-age=3600',
                'Content-Disposition' => 'inline'
            ]);

        } catch (\Exception $e) {
            Log::error('Segment access error: ' . $e->getMessage());
            abort(500);
        }
    }

    /**
     * إرجاع مفتاح التشفير مع حماية إضافية
     */
    public function getKey(Request $request, Lesson $lesson)
    {
        try {
            /** @var User $user */
            $user = auth()->user();

            if (!$this->canAccessLesson($user, $lesson)) {
                abort(403, 'غير مصرح');
            }

            $keyPath = storage_path("app/private_videos/hls/lesson_{$lesson->id}/enc.key");

            if (!file_exists($keyPath)) {
                abort(404, 'مفتاح التشفير غير متوفر');
            }

            // إضافة headers أمان إضافية
            return response()->file($keyPath, [
                'Content-Type' => 'application/octet-stream',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'X-Robots-Tag' => 'noindex, nofollow, nosnippet, noarchive'
            ]);

        } catch (\Exception $e) {
            Log::error('Key access error: ' . $e->getMessage());
            abort(500);
        }
    }

    /**
     * حالة معالجة الفيديو
     */
    public function getProcessingStatus(Lesson $lesson)
    {
        $status = $lesson->video_status ?? 'not_uploaded';
        $progress = match($status) {
            'processing' => 50,
            'ready' => 100,
            'failed' => 0,
            default => 0
        };

        $response = [
            'lesson_id' => $lesson->id,
            'status' => $status,
            'processing_progress' => $progress,
            'video_available' => $status === 'ready',
            'message' => $this->getStatusMessage($status)
        ];

        if ($status === 'ready') {
            $response['playlist_url'] = $lesson->getVideoPlaylistUrl();
            $response['encryption_key_url'] = route('lesson.key', ['lesson' => $lesson->id]);
        }

        return response()->json($response);
    }

    /**
     * حذف الفيديو (admin only)
     */
    public function deleteVideo(Request $request, Lesson $lesson)
    {
        if (!$request->user()->isAdmin('admin')) {
            return $this->errorResponse('غير مصرح', 403);
        }

        $this->deleteOldVideo($lesson);

        $lesson->update([
            'video_path' => null,
            'video_status' => null
        ]);

        return $this->successResponse(['message' => 'تم حذف الفيديو بنجاح']);
    }

    /**
     * التحقق من صلاحية الوصول للدرس
     */
    private function canAccessLesson(?User $user, Lesson $lesson): bool
    {
        if (!$user) {
            return false;
        }

        // التحقق من الجنس المستهدف
        if ($lesson->target_gender !== 'both' && $lesson->target_gender !== $user->gender) {
            return false;
        }

        // إذا كان الدرس مجاني
        if ($lesson->is_free) {
            return true;
        }

        // التحقق من الاشتراك
        return $user->subscriptions()
            ->where('course_id', $lesson->course_id)
            ->where('is_active', true)
            ->where('is_approved', true)
            ->exists();
    }

    /**
     * تعديل روابط الـ playlist لإضافة tokens
     */
    private function modifyPlaylistUrls(string $content, int $lessonId): string
    {
        $lines = explode("\n", $content);
        $modifiedLines = [];

        foreach ($lines as $line) {
            if (preg_match('/\.ts$/', trim($line))) {
                // إنشاء token للـ segment
                $token = $this->generateSegmentToken($lessonId, trim($line));
                $url = route('lesson.segment', ['lessonId' => $lessonId, 'segment' => trim($line)]) . '?token=' . $token;
                $modifiedLines[] = $url;
            } elseif (preg_match('/URI="([^"]+)"/', $line, $matches)) {
                // تعديل URI للمفتاح
                $keyUrl = route('lesson.key', ['lesson' => $lessonId]);
                $line = str_replace($matches[1], $keyUrl, $line);
                $modifiedLines[] = $line;
            } else {
                $modifiedLines[] = $line;
            }
        }

        return implode("\n", $modifiedLines);
    }

    /**
     * إنشاء token للـ segment
     */
    private function generateSegmentToken(int $lessonId, string $segment): string
    {
        $data = [
            'lesson_id' => $lessonId,
            'segment' => $segment,
            'user_id' => auth()->id(),
            'expires_at' => now()->addMinutes(10)->timestamp
        ];

        $token = base64_encode(json_encode($data));
        Cache::put("segment_token_{$token}", true, 600); // 10 دقائق

        return $token;
    }

    /**
     * التحقق من صحة token الـ segment
     */
    private function validateSegmentToken(?string $token, int $lessonId, string $segment): bool
    {
        if (!$token) {
            return false;
        }

        if (!Cache::has("segment_token_{$token}")) {
            return false;
        }

        try {
            $data = json_decode(base64_decode($token), true);

            return $data['lesson_id'] == $lessonId
                && $data['segment'] == $segment
                && $data['user_id'] == auth()->id()
                && $data['expires_at'] > now()->timestamp;

        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * حذف الفيديو السابق
     */
    private function deleteOldVideo(Lesson $lesson): void
    {
        if ($lesson->video_path) {
            // حذف المجلد الكامل للدرس
            $hlsDir = "private_videos/hls/lesson_{$lesson->id}";
            Storage::deleteDirectory($hlsDir);

            // حذف الفيديو المؤقت
            if (Storage::exists($lesson->video_path)) {
                Storage::delete($lesson->video_path);
            }
        }
    }

    /**
     * رسالة حالة المعالجة
     */
    private function getStatusMessage(string $status): string
    {
        return match($status) {
            'processing' => 'جاري معالجة الفيديو وتشفيره...',
            'ready' => 'الفيديو جاهز للمشاهدة',
            'failed' => 'فشل في معالجة الفيديو',
            default => 'لم يتم رفع الفيديو بعد'
        };
    }
}