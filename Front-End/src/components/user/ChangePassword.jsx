import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../api/auth";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const ChangePassword = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.current_password.trim() ||
      !formData.new_password.trim() ||
      !formData.new_password_confirmation.trim()
    ) {
      setError(t("changePassword.validation.allFieldsRequired"));
      return;
    }
    if (
      formData.new_password.trim() !== formData.new_password_confirmation.trim()
    ) {
      setError(t("changePassword.validation.passwordsNotMatch"));
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await changePassword(formData, token);
      setSuccess(true);
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      setError(err.message || t("changePassword.changeError"));
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="mx-auto w-full p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t("changePassword.title")}
          </h2>
          <button
            onClick={handleCancel}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <FaTimes
              className={`${i18next.language === "ar" ? "ml-2" : "mr-2"}`}
              size={16}
            />
            {t("changePassword.clear")}
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {success && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
              {t("changePassword.passwordChanged")}
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("changePassword.currentPassword")}
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("changePassword.newPassword")}
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("changePassword.confirmNewPassword")}
                </label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                      {t("changePassword.saving")}
                    </div>
                  ) : (
                    <>
                      <FaSave
                        className={`${
                          i18next.language === "ar" ? "ml-2" : "mr-2"
                        }`}
                        size={16}
                      />
                      {t("changePassword.saveChanges")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
