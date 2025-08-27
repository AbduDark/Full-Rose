import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiBell, FiUsers, FiBarChart2 } from "react-icons/fi";
import {
  getNotificationsStatistics,
  getAllNotifications,
} from "../../../api/notifications";
import CreateNotification from "./Createnotifications";
import SearchNotifications from "./Searchnotifications";
import CardNotification from "./Cardnotifications";

const NotificationsManager = () => {
  const { t } = useTranslation();
  const [statistics, setStatistics] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = recentNotifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notification.user?.name &&
          notification.user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesType =
        selectedType === "all" || notification.type === selectedType;
      return matchesSearch && matchesType;
    });
    setFilteredNotifications(filtered);
  }, [recentNotifications, searchTerm, selectedType]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, notificationsResponse] = await Promise.all([
        getNotificationsStatistics(),
        getAllNotifications(1),
      ]);

      setStatistics(statsResponse.data);
      setRecentNotifications(statsResponse.data.recent_notifications || []);
      setError("");
    } catch (err) {
      setError(
        t("adminDashboard.notificationsManager.failedToFetch") +
          ": " +
          err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSent = () => {
    setIsCreateModalOpen(false);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">
          {t("adminDashboard.notificationsManager.loadingNotifications")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex justify-between  md:flex-row flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {t("adminDashboard.notificationsManager.title")}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center mt-4 md:mt-0 gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg"
            >
              <FiPlus className="w-4 h-4" />
              {t("adminDashboard.notificationsManager.sendNotification")}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">
                    {t(
                      "adminDashboard.notificationsManager.statistics.totalNotifications"
                    )}
                  </p>
                  <p className="text-2xl font-bold">
                    {statistics.total_notifications}
                  </p>
                </div>
                <FiBell className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">
                    {t(
                      "adminDashboard.notificationsManager.statistics.sentToday"
                    )}
                  </p>
                  <p className="text-2xl font-bold">{statistics.sent_today}</p>
                </div>
                <FiBarChart2 className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">
                    {t(
                      "adminDashboard.notificationsManager.statistics.readNotifications"
                    )}
                  </p>
                  <p className="text-2xl font-bold">
                    {statistics.read_notifications}
                  </p>
                </div>
                <FiUsers className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">
                    {t(
                      "adminDashboard.notificationsManager.statistics.unreadNotifications"
                    )}
                  </p>
                  <p className="text-2xl font-bold">
                    {statistics.unread_notifications}
                  </p>
                </div>
                <FiBell className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <SearchNotifications
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </div>

      {/* Notifications Grid */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <FiBell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            {t("adminDashboard.notificationsManager.noNotificationsFound")}
          </h3>
          <p className="text-gray-400">
            {searchTerm || selectedType !== "all"
              ? t("adminDashboard.searchNotification.noResults")
              : t("adminDashboard.notificationsManager.sendNotification")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotifications.map((notification) => (
            <CardNotification
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}

      {/* Create Notification Modal */}
      <CreateNotification
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNotificationSent={handleNotificationSent}
      />
    </div>
  );
};

export default NotificationsManager;
