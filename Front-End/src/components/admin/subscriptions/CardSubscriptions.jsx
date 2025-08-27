import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBookOpen,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";

function CardSubscriptions({ subscription, onApprove, onReject }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return t("adminDashboard.cardSubscription.approved");
      case "pending":
        return t("adminDashboard.cardSubscription.pending");
      case "rejected":
        return t("adminDashboard.cardSubscription.rejected");
      default:
        return status;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-purple-100 text-purple-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("adminDashboard.cardSubscription.notSet");
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (!price) return t("adminDashboard.cardSubscription.free");
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-gray-600">
      <div className="p-6">
        {/* Header with Course Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiBookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white line-clamp-1">
                {subscription.course?.title ||
                  t("adminDashboard.cardSubscription.unknownCourse")}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    subscription.status
                  )}`}
                >
                  {getStatusText(subscription.status)}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(
                    subscription.course?.level
                  )}`}
                >
                  {subscription.course?.level ||
                    t("adminDashboard.cardSubscription.unknownLevel")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {subscription.status === "pending" && (
              <>
                <button
                  onClick={onApprove}
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                  title={t(
                    "adminDashboard.cardSubscription.approveSubscription"
                  )}
                >
                  <FiCheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={onReject}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title={t(
                    "adminDashboard.cardSubscription.rejectSubscription"
                  )}
                >
                  <FiXCircle className="w-4 h-4" />
                </button>
              </>
            )}
            {/* <button
              onClick={() => onEdit(subscription)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title={t("adminDashboard.cardSubscription.editSubscription")}
            >
              <FiEdit className="w-4 h-4" />
            </button> */}
            {/* <button
              onClick={() => onDelete(subscription)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title={t("adminDashboard.cardSubscription.deleteSubscription")}
            >
              <FiTrash2 className="w-4 h-4" />
            </button> */}
          </div>
        </div>

        {/* Course Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <FiDollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {t("adminDashboard.cardSubscription.price")}:{" "}
              {formatPrice(subscription.course?.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <FiClock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {t("adminDashboard.cardSubscription.duration")}:{" "}
              {subscription.course?.duration_hours || 0}{" "}
              {t("adminDashboard.cardSubscription.hours")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <FiUser className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {t("adminDashboard.cardSubscription.instructor")}:{" "}
              {subscription.course?.instructor_name ||
                t("adminDashboard.cardSubscription.unknownInstructor")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <FiCalendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {t("adminDashboard.cardSubscription.grade")}:{" "}
              {subscription.course?.grade ||
                t("adminDashboard.cardSubscription.unknownLevel")}
            </span>
          </div>
        </div>

        {/* User Information */}
        <div className="border-t border-gray-700 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            {t("adminDashboard.cardSubscription.studentInformation")}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <FiUser className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {subscription.user?.name ||
                  t("adminDashboard.cardSubscription.unknownStudent")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <FiMail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {subscription.user?.email ||
                  t("adminDashboard.cardSubscription.noEmail")}
              </span>
            </div>

            {subscription.vodafone_number && (
              <div className="flex items-center gap-2 text-gray-300">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{subscription.vodafone_number}</span>
              </div>
            )}

            {subscription.parent_phone && (
              <div className="flex items-center gap-2 text-gray-300">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {t("adminDashboard.cardSubscription.parent")}:{" "}
                  {subscription.parent_phone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Details */}
        <div className="border-t border-gray-700 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            {t("adminDashboard.cardSubscription.subscriptionDetails")}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-300">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {t("adminDashboard.cardSubscription.subscribed")}:{" "}
                {formatDate(subscription.subscribed_at)}
              </span>
            </div>

            {subscription.expires_at && (
              <div className="flex items-center gap-2 text-gray-300">
                <FiClock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {t("adminDashboard.cardSubscription.expires")}:{" "}
                  {formatDate(subscription.expires_at)}
                </span>
              </div>
            )}

            {subscription.student_info && (
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">
                  {t("adminDashboard.cardSubscription.notes")}:{" "}
                </span>
                {subscription.student_info}
              </div>
            )}

            {subscription.admin_notes && (
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">
                  {t("adminDashboard.cardSubscription.adminNotes")}:{" "}
                </span>
                {subscription.admin_notes}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            {subscription.is_active ? (
              <div className="flex items-center gap-1 text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                <span className="text-xs">
                  {t("adminDashboard.cardSubscription.active")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-400">
                <FiXCircle className="w-4 h-4" />
                <span className="text-xs">
                  {t("adminDashboard.cardSubscription.inactive")}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-400">
            {t("adminDashboard.cardSubscription.id")}: {subscription.id}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSubscriptions;
