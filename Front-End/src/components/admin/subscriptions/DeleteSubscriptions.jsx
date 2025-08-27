import React from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi";

function DeleteSubscriptions({
  subscription,
  onSubscriptionDeleted,
  isOpen,
  onClose,
}) {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (onSubscriptionDeleted) {
      onSubscriptionDeleted(subscription.id);
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t("adminDashboard.deleteSubscription.title")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <FiAlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-medium text-white mb-2">
            {t("adminDashboard.deleteSubscription.confirmMessage")}
          </h4>
          <p className="text-gray-400">
            {t("adminDashboard.deleteSubscription.warning")}
          </p>
        </div>

        {/* Subscription Details */}
        <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <h5 className="text-sm font-medium text-gray-400 mb-3">
            {t("adminDashboard.cardSubscription.subscriptionDetails")}
          </h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">
                {t("adminDashboard.cardSubscription.studentInformation")}:{" "}
              </span>
              <span className="text-white">
                {subscription.user?.name ||
                  t("adminDashboard.cardSubscription.unknownStudent")}
              </span>
            </div>
            <div>
              <span className="text-gray-400">
                {t("adminDashboard.cardSubscription.instructor")}:{" "}
              </span>
              <span className="text-white">
                {subscription.course?.title ||
                  t("adminDashboard.cardSubscription.unknownCourse")}
              </span>
            </div>
            <div>
              <span className="text-gray-400">
                {t("adminDashboard.createSubscription.status")}:{" "}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  subscription.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : subscription.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {t(`adminDashboard.cardSubscription.${subscription.status}`)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">
                {t("adminDashboard.cardSubscription.id")}:{" "}
              </span>
              <span className="text-white">{subscription.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            {t("adminDashboard.deleteSubscription.deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSubscriptions;
