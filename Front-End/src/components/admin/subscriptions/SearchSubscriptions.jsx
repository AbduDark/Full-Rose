import React from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

function SearchSubscriptions({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedCourse,
  setSelectedCourse,
  uniqueCourses,
}) {
  const { t } = useTranslation();

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedCourse("all");
  };

  const hasActiveFilters =
    searchTerm || selectedStatus !== "all" || selectedCourse !== "all";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t("adminDashboard.searchSubscription.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400 w-4 h-4" />
          <span className="text-sm text-gray-400">
            {t("filtersCourses.filterBy")}:
          </span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-400">
            {t("adminDashboard.subscriptionsManager.filterByStatus")}:
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">
              {t("adminDashboard.subscriptionsManager.allStatuses")}
            </option>
            <option value="pending">
              {t("adminDashboard.cardSubscription.pending")}
            </option>
            <option value="approved">
              {t("adminDashboard.cardSubscription.approved")}
            </option>
            <option value="rejected">
              {t("adminDashboard.cardSubscription.rejected")}
            </option>
          </select>
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="course-filter" className="text-sm text-gray-400">
            {t("adminDashboard.subscriptionsManager.filterByCourse")}:
          </label>
          <select
            id="course-filter"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">
              {t("adminDashboard.subscriptionsManager.allCourses")}
            </option>
            {uniqueCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FiX className="w-4 h-4" />
            {t("filtersCourses.clearFilters")}
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">
            {t("filtersCourses.filterBy")}:
          </span>

          {searchTerm && (
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              {t("adminDashboard.searchSubscription.searchButton")}: "
              {searchTerm}"
            </span>
          )}

          {selectedStatus !== "all" && (
            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
              {t("adminDashboard.subscriptionsManager.filterByStatus")}:{" "}
              {t(`adminDashboard.cardSubscription.${selectedStatus}`)}
            </span>
          )}

          {selectedCourse !== "all" && (
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
              {t("adminDashboard.subscriptionsManager.filterByCourse")}:{" "}
              {uniqueCourses.find((c) => c.id.toString() === selectedCourse)
                ?.title || selectedCourse}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchSubscriptions;
