import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiBell,
  FiClock,
  FiUser,
  FiBook,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function CardNotification({ notification }) {
  const { t } = useTranslation();

  const getTypeColor = (type) => {
    switch (type) {
      case "general":
        return "bg-blue-100 text-blue-800";
      case "course":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "general":
        return t("adminDashboard.cardNotification.general");
      case "course":
        return t("adminDashboard.cardNotification.course");
      case "system":
        return t("adminDashboard.cardNotification.system");
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl shadow-lg border transition-all duration-300 overflow-hidden hover:shadow-xl ${
        notification.is_read
          ? "border-gray-700 hover:border-gray-600"
          : "border-blue-500 hover:border-blue-400"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                notification.is_read ? "bg-gray-700" : "bg-blue-500/20"
              }`}
            >
              <FiBell
                className={`w-5 h-5 ${
                  notification.is_read ? "text-gray-400" : "text-blue-400"
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {notification.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                    notification.type
                  )}`}
                >
                  {getTypeText(notification.type)}
                </span>
                {!notification.is_read && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {t("adminDashboard.cardNotification.unread")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            {notification.is_read ? (
              <FiEye className="w-4 h-4" />
            ) : (
              <FiEyeOff className="w-4 h-4 text-blue-400" />
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              <span>{formatDate(notification.created_at)}</span>
            </div>
            {notification.user && (
              <div className="flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                <span>{notification.user.name}</span>
              </div>
            )}
            {notification.course && (
              <div className="flex items-center gap-1">
                <FiBook className="w-4 h-4" />
                <span>{notification.course.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Data */}
        {notification.data &&
          (notification.data.lesson_id || notification.data.url) && (
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                {t("adminDashboard.cardNotification.additionalData")}:
              </h4>
              <div className="space-y-1 text-sm text-gray-400">
                {notification.data.lesson_id && (
                  <div>
                    {t("adminDashboard.cardNotification.lessonId")}:{" "}
                    {notification.data.lesson_id}
                  </div>
                )}
                {notification.data.url && (
                  <div>
                    {t("adminDashboard.cardNotification.url")}:
                    <a
                      href={notification.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 ml-1"
                    >
                      {notification.data.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default CardNotification;
