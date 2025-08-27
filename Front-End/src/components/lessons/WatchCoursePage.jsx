import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft } from "react-icons/fa";
import ReactPlayer from "react-player";
import CommentLesson from "./CommentLesson";
import Sidebar from "./Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonsByCourse } from "../../api/lessons";
import { useAuth } from "../../context/AuthContext";

const WatchCoursePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const { token } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [isPurchased] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!courseId) {
        setError(t("lessons.courseInfo.title"));
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getLessonsByCourse(courseId, token);
        const list = Array.isArray(data) ? data : data?.data || [];
        setLessons(list);
        if (lessonId) {
          setCurrentLessonId(Number(lessonId));
        } else if (list.length) {
          setCurrentLessonId(list[0].id);
          navigate(`/courses/${courseId}/lessons/${list[0].id}`, {
            replace: true,
          });
        } else {
          setError(t("lessons.sidebar.noEpisodes"));
        }
      } catch (e) {
        setError(e.message || t("lessons.videoPlayer.error"));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [courseId, lessonId, navigate, token]);

  const currentLesson = useMemo(() => {
    return lessons.find((l) => l.id === Number(currentLessonId));
  }, [lessons, currentLessonId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-primary">
          {t("lessons.videoPlayer.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (!isPurchased) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-12 min-h-screen">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-primary">
            {t("lessons.title")}
          </h1>
          <p className="text-gray-600 mb-6">
            {t("overviewCourse.subscribeToView")}
          </p>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary">
            {t("enrollCourse.enrollNow")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div
        dir="ltr"
        className="flex items-center justify-between p-4 border-b bg-white"
      >
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <FaChevronLeft className="h-5 w-5 text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-primary">
              {t("lessons.title")} #{courseId}
            </h1>
            {currentLesson && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">{currentLesson.title}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 p-4 gap-4 overflow-auto">
          {currentLesson?.video_url ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <ReactPlayer
                url={currentLesson.video_url}
                controls
                width="100%"
                height="100%"
                className="absolute top-0 left-0 rounded-lg"
                onError={(e) => setVideoError(t("lessons.videoPlayer.error"))}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
              {videoError && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <p className="text-white text-lg font-medium">{videoError}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-lg font-medium">
                {t("lessons.videoPlayer.error")}
              </p>
            </div>
          )}
          {currentLessonId && <CommentLesson lessonId={currentLessonId} />}
        </div>
        <div className="lg:w-80 bg-white border-l p-4 overflow-auto">
          <Sidebar
            lessons={lessons}
            currentLessonId={currentLessonId}
            onSelectLesson={(l) =>
              navigate(`/courses/${courseId}/lessons/${l.id}`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default WatchCoursePage;
