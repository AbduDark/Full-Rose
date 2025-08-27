import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../api/notifications";
import { useNotifications } from "../context/NotificationContext";

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { unreadCount, resetUnreadCount, decrementUnreadCount } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllNotifications(currentPage);

      if (response.success) {
        setNotifications(response.data.data);
        setTotalPages(response.data.last_page);
      } else {
        setError(t("notifications.failedToFetch"));
      }
    } catch (error) {
      setError(t("notifications.errorLoading"));
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      resetUnreadCount();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
      decrementUnreadCount();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      const deletedNotification = notifications.find((n) => n.id === id);
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      if (deletedNotification && !deletedNotification.is_read) {
        decrementUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return t("notifications.justNow");
    if (diffInMinutes < 60)
      return `${diffInMinutes}${t("notifications.minutesAgo")}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}${t("notifications.hoursAgo")}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}${t("notifications.daysAgo")}`;

    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "course":
        return "📚";
      case "lesson":
        return "🎥";
      case "system":
        return "🔔";
      default:
        return "📢";
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {t("notifications.loadingNotifications")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("notifications.title")}
                </h1>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-800 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  {t("notifications.markAllAsRead")}
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("notifications.noNotifications")}
                </h3>
                <p className="text-gray-500">
                  {t("notifications.noNotificationsDescription")}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 transition-all hover:bg-gray-50 ${
                    !notification.is_read ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.course && (
                            <p className="text-sm text-blue-600 mt-1">
                              {t("notifications.course")}:{" "}
                              {notification.course.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>

                        {!notification.is_read && (
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                        )}
                      </div>

                      <div className="mt-4 flex space-x-3">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {t("notifications.markAsRead")}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          {t("notifications.delete")}
                        </button>
                        {notification.data?.url && (
                          <a
                            href={notification.data.url}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            {t("notifications.viewDetails")}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("notifications.previous")}
                </button>
                <span className="text-sm text-gray-700">
                  {t("notifications.page")} {currentPage}{" "}
                  {t("notifications.of")} {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("notifications.next")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
