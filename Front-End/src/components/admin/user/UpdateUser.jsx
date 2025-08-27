import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import { updateUser } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";

function UpdateUser({ user, onUserUpdated, isOpen, onClose }) {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "male",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
      };

      const response = await updateUser(user.id, userData);

      onClose();
      if (onUserUpdated) {
        onUserUpdated(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t("adminDashboard.updateUser.title")}
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

        <form onSubmit={handleUpdateUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.updateUser.fullName")} *
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={t("adminDashboard.updateUser.enterFullName")}
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.updateUser.emailAddress")} *
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={t("adminDashboard.updateUser.enterEmail")}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.updateUser.phoneNumber")}
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("adminDashboard.updateUser.enterPhone")}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.updateUser.gender")} *
              </label>
              <select
                name="gender"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">
                  {t("adminDashboard.updateUser.male")}
                </option>
                <option value="female">
                  {t("adminDashboard.updateUser.female")}
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("adminDashboard.updateUser.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? t("adminDashboard.updateUser.updating")
                : t("adminDashboard.updateUser.updateUser")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
