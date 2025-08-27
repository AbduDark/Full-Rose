import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaFilePdf,
  FaUserCircle,
  FaPaperPlane,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import {
  getLessonComments,
  createComment,
  deleteComment,
} from "../../api/lessons";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import i18next from "i18next";

function CommentLesson() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const { courseId, lessonId } = useParams();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ content: "" });

  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLessonComments(courseId, token);
        setComments(data || []);
      } catch (e) {
        setError(e.message || t("lessons.comments.loadingComments"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [courseId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment(
        { lesson_id: Number(lessonId), content: form.content.trim() },
        token
      );
      setForm({ content: "" });
      const data = await getLessonComments(courseId, token);
      setComments(data || []);
    } catch (e) {
      setError(e.message || t("lessons.comments.commentError"));
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteComment(id, token);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaFilePdf className="text-blue-600 text-xl" />
          <h3 className="text-xl font-bold text-gray-800">
            {t("lessons.comments.title")}
          </h3>
        </div>
        <span className="text-sm text-gray-500">
          {comments.length}{" "}
          {comments.length === 1
            ? t("lessons.comments.title").slice(0, -1)
            : t("lessons.comments.title")}
        </span>
      </div>
      <div className="mb-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
            {error}
          </div>
        ) : comments.length ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="text-gray-400 mt-1">
                    {comment.user?.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">
                        {comment.user?.name || "Anonymous"}
                      </span>
                      {token && user?.id && comment.user?.id === user.id && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className={`${
                            i18next.language === "ar" ? "mr-auto" : "ml-auto"
                          } text-red-500 hover:text-red-700`}
                          title="Delete comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t("lessons.comments.noComments")}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("lessons.comments.addComment")}
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={(e) => setForm({ content: e.target.value })}
            placeholder={t("lessons.comments.addComment")}
            rows={4}
            className="w-full border p-3 rounded-lg focus:border-none"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !form.content.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isSubmitting || !form.content.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" />
                {t("lessons.comments.posting")}
              </>
            ) : (
              <>
                <FaPaperPlane />
                {t("lessons.comments.postComment")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentLesson;
