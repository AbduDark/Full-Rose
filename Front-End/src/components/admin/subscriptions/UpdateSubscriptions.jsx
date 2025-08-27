import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

function UpdateSubscriptions({
  subscription,
  onSubscriptionUpdated,
  isOpen,
  onClose,
}) {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    status: "pending",
    vodafone_number: "",
    parent_phone: "",
    student_info: "",
    admin_notes: "",
    is_active: false,
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        status: subscription.status || "pending",
        vodafone_number: subscription.vodafone_number || "",
        parent_phone: subscription.parent_phone || "",
        student_info: subscription.student_info || "",
        admin_notes: subscription.admin_notes || "",
        is_active: subscription.is_active || false,
      });
    }
  }, [subscription]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For now, we'll just simulate subscription update since the API endpoint wasn't provided
      // In a real implementation, you would call the update subscription API here
      const updatedSubscription = {
        ...subscription,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      onClose();
      if (onSubscriptionUpdated) {
        onSubscriptionUpdated(updatedSubscription);
      }
    } catch (err) {
      setError(
        t("adminDashboard.updateSubscription.updateError") + ": " + err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t("adminDashboard.updateSubscription.title")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Subscription Info Display */}
        <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            {t("adminDashboard.cardSubscription.subscriptionDetails")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                {t("adminDashboard.cardSubscription.id")}:{" "}
              </span>
              <span className="text-white">{subscription.id}</span>
            </div>
            <div>
              <span className="text-gray-400">
                {t("adminDashboard.cardSubscription.subscribed")}:{" "}
              </span>
              <span className="text-white">
                {subscription.created_at
                  ? new Date(subscription.created_at).toLocaleDateString()
                  : t("adminDashboard.cardSubscription.notSet")}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateSubscription}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.status")} *
              </label>
              <select
                name="status"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">
                  {t("adminDashboard.createSubscription.pending")}
                </option>
                <option value="approved">
                  {t("adminDashboard.createSubscription.approved")}
                </option>
                <option value="rejected">
                  {t("adminDashboard.createSubscription.rejected")}
                </option>
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <label
                htmlFor="is_active"
                className="ml-2 text-sm font-medium text-gray-300"
              >
                {t("adminDashboard.cardSubscription.active")}{" "}
                {t(
                  "adminDashboard.cardSubscription.subscriptionDetails"
                ).toLowerCase()}
              </label>
            </div>

            {/* Vodafone Number */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.vodafoneNumber")} *
              </label>
              <input
                type="tel"
                name="vodafone_number"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.vodafone_number}
                onChange={handleInputChange}
                required
                placeholder={t(
                  "adminDashboard.createSubscription.vodafonePlaceholder"
                )}
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.parentPhone")}
              </label>
              <input
                type="tel"
                name="parent_phone"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.parent_phone}
                onChange={handleInputChange}
                placeholder={t(
                  "adminDashboard.createSubscription.parentPhonePlaceholder"
                )}
              />
            </div>

            {/* Student Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.studentInfo")}
              </label>
              <textarea
                name="student_info"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.student_info}
                onChange={handleInputChange}
                placeholder={t(
                  "adminDashboard.createSubscription.studentInfoPlaceholder"
                )}
                rows="3"
              />
            </div>

            {/* Admin Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.adminNotes")}
              </label>
              <textarea
                name="admin_notes"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.admin_notes}
                onChange={handleInputChange}
                placeholder={t(
                  "adminDashboard.createSubscription.adminNotesPlaceholder"
                )}
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? t("adminDashboard.updateSubscription.updating")
                : t("adminDashboard.updateSubscription.updateButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateSubscriptions;
