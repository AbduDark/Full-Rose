import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

function Sidebar({ lessons = [], currentLessonId, onSelectLesson }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const completionPercentage = useMemo(() => {
    if (!lessons.length) return 0;
    const completed = lessons.filter((l) => l.isCompleted).length;
    return Math.round((completed / lessons.length) * 100);
  }, [lessons]);

  return (
    <div className="w-full max-w-sm border-l overflow-auto">
      <div className="p-4 border-b">
        <h3 className="font-bold">{t("lessons.sidebar.title")}</h3>
        {/* <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {completionPercentage}% Complete
          </span>
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div> */}
      </div>
      <div className="divide-y">
        <div className="py-2">
          <div
            className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => setIsExpanded((v) => !v)}
          >
            <h4 className="font-medium">{t("lessons.sidebar.episodes")}</h4>
            <span>{isExpanded ? "−" : "+"}</span>
          </div>
          {isExpanded && (
            <div className="pl-6">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`p-3 cursor-pointer ${
                    lesson.id === currentLessonId
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onSelectLesson?.(lesson)}
                >
                  <div className="flex items-center gap-2">
                    {lesson.isCompleted ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                    )}
                    <span>{lesson.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
