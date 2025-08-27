import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiUsers,
  FiBook,
  FiCreditCard,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiPieChart,
  FiActivity,
} from "react-icons/fi";
import { getDashboardStats } from "../../../api/auth";
import ChartComponent from "./ChartComponent";

const DashboardOverview = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);
      setError("");
    } catch (err) {
      setError(
        t("adminDashboard.dashboardOverview.failedToFetchStats") + err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">
          {t("adminDashboard.dashboardOverview.loadingDashboard")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  const { general_stats, monthly_stats } = stats;

  // Calculate percentages for progress bars
  const activeCoursesPercentage =
    (general_stats.active_courses / general_stats.total_courses) * 100;
  const activeSubscriptionsPercentage =
    (general_stats.active_subscriptions / general_stats.total_subscriptions) *
    100;
  const approvedSubscriptionsPercentage =
    (general_stats.approved_subscriptions / general_stats.total_subscriptions) *
    100;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {t("adminDashboard.dashboardOverview.title")}
            </h2>
            <p className="text-gray-400 mt-1">
              {t("adminDashboard.dashboardOverview.welcome")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <FiActivity className="w-6 h-6" />
            <span className="text-sm font-medium">
              {t("adminDashboard.dashboardOverview.liveDashboard")}
            </span>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                {t("adminDashboard.dashboardOverview.totalUsers")}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {general_stats.total_users.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-blue-100 text-sm">
                  +{monthly_stats.new_users_this_month}{" "}
                  {t("adminDashboard.dashboardOverview.thisMonth")}
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-400/20 rounded-lg">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                {t("adminDashboard.dashboardOverview.totalCourses")}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {general_stats.total_courses.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <FiCheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-green-100 text-sm">
                  {general_stats.active_courses}{" "}
                  {t("adminDashboard.dashboardOverview.active")}
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-400/20 rounded-lg">
              <FiBook className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Subscriptions */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                {t("adminDashboard.dashboardOverview.totalSubscriptions")}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {general_stats.total_subscriptions.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <FiTrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-purple-100 text-sm">
                  +{monthly_stats.new_subscriptions_this_month}{" "}
                  {t("adminDashboard.dashboardOverview.thisMonth")}
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-400/20 rounded-lg">
              <FiCreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                {t("adminDashboard.dashboardOverview.activeSubscriptions")}
              </p>
              <p className="text-3xl font-bold text-white mt-2">
                {general_stats.active_subscriptions.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <FiCheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-orange-100 text-sm">
                  {approvedSubscriptionsPercentage.toFixed(1)}%{" "}
                  {t("adminDashboard.dashboardOverview.approved")}
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-400/20 rounded-lg">
              <FiTrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Charts */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">
            {t("adminDashboard.dashboardOverview.progressOverview")}
          </h3>

          <div className="space-y-6">
            {/* Active Courses Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">
                  {t("adminDashboard.dashboardOverview.activeCourses")}
                </span>
                <span className="text-green-400 text-sm font-medium">
                  {activeCoursesPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${activeCoursesPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  {general_stats.active_courses}{" "}
                  {t("adminDashboard.dashboardOverview.active")}
                </span>
                <span>
                  {general_stats.total_courses}{" "}
                  {t("adminDashboard.dashboardOverview.total")}
                </span>
              </div>
            </div>

            {/* Active Subscriptions Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">
                  {t("adminDashboard.dashboardOverview.activeSubscriptions")}
                </span>
                <span className="text-blue-400 text-sm font-medium">
                  {activeSubscriptionsPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${activeSubscriptionsPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  {general_stats.active_subscriptions}{" "}
                  {t("adminDashboard.dashboardOverview.active")}
                </span>
                <span>
                  {general_stats.total_subscriptions}{" "}
                  {t("adminDashboard.dashboardOverview.total")}
                </span>
              </div>
            </div>

            {/* Approved Subscriptions Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">
                  {t("adminDashboard.dashboardOverview.approvedSubscriptions")}
                </span>
                <span className="text-purple-400 text-sm font-medium">
                  {approvedSubscriptionsPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${approvedSubscriptionsPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>
                  {general_stats.approved_subscriptions}{" "}
                  {t("adminDashboard.dashboardOverview.approved")}
                </span>
                <span>
                  {general_stats.total_subscriptions}{" "}
                  {t("adminDashboard.dashboardOverview.total")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">
            {t("adminDashboard.dashboardOverview.quickStatistics")}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Students */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FiUsers className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    {t("adminDashboard.dashboardOverview.students")}
                  </p>
                  <p className="text-xl font-bold text-white">
                    {general_stats.total_students}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Subscriptions */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <FiClock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    {t("adminDashboard.dashboardOverview.pending")}
                  </p>
                  <p className="text-xl font-bold text-white">
                    {general_stats.pending_subscriptions}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Growth */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    {t("adminDashboard.dashboardOverview.newUsers")}
                  </p>
                  <p className="text-xl font-bold text-white">
                    +{monthly_stats.new_users_this_month}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t("adminDashboard.dashboardOverview.thisMonth")}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Subscriptions */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FiBarChart2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">
                    {t("adminDashboard.dashboardOverview.newSubscriptions")}
                  </p>
                  <p className="text-xl font-bold text-white">
                    +{monthly_stats.new_subscriptions_this_month}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t("adminDashboard.dashboardOverview.thisMonth")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiPieChart className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDashboard.dashboardOverview.userGrowth")}
              </p>
              <p className="text-2xl font-bold text-white">
                {(
                  (monthly_stats.new_users_this_month /
                    general_stats.total_users) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-gray-400">
                {t("adminDashboard.dashboardOverview.monthlyGrowthRate")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiCheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDashboard.dashboardOverview.courseActivity")}
              </p>
              <p className="text-2xl font-bold text-white">
                {activeCoursesPercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400">
                {t("adminDashboard.dashboardOverview.activeCourses")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FiCreditCard className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {t("adminDashboard.dashboardOverview.subscriptionRate")}
              </p>
              <p className="text-2xl font-bold text-white">
                {(
                  (general_stats.total_subscriptions /
                    general_stats.total_users) *
                  100
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-gray-400">
                {t("adminDashboard.dashboardOverview.userSubscriptionRate")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Status Chart */}
        <ChartComponent
          data={[
            {
              label: t("adminDashboard.dashboardOverview.active"),
              value: general_stats.active_subscriptions,
              color: "#10B981",
            },
            {
              label: t("adminDashboard.dashboardOverview.pending"),
              value: general_stats.pending_subscriptions,
              color: "#F59E0B",
            },
            {
              label: t("adminDashboard.dashboardOverview.approved"),
              value: general_stats.approved_subscriptions,
              color: "#3B82F6",
            },
          ]}
          title={t("adminDashboard.dashboardOverview.subscriptionStatus")}
          type="pie"
        />

        {/* Course Activity Chart */}
        <ChartComponent
          data={[
            {
              label: t("adminDashboard.dashboardOverview.active"),
              value: general_stats.active_courses,
              color: "#10B981",
            },
            {
              label: t("adminDashboard.dashboardOverview.total"),
              value: general_stats.total_courses,
              color: "#6B7280",
            },
          ]}
          title={t("adminDashboard.dashboardOverview.courseActivity")}
          type="bar"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
