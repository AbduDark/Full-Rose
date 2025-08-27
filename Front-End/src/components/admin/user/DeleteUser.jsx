import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiXCircle } from "react-icons/fi";
import { deleteUser } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";

function DeleteUser({ user, onUserDeleted, isOpen, onClose }) {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteUser = async () => {
    setIsLoading(true);
    setError("");

    try {
      await deleteUser(user.id);
      onClose();
      if (onUserDeleted) {
        onUserDeleted(user.id);
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
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700">
        <div className="text-center">
          <FiXCircle className="w-11 h-11 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {t("adminDashboard.deleteUser.title")}
          </h3>
          <p className="mb-4 text-gray-300">
            {t("adminDashboard.deleteUser.confirmationMessage", {
              name: user.name,
            })}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={onClose}
              className="py-2 px-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg border border-gray-500 hover:bg-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {t("adminDashboard.deleteUser.cancel")}
            </button>
            <button
              onClick={handleDeleteUser}
              className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? t("adminDashboard.deleteUser.deleting")
                : t("adminDashboard.deleteUser.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteUser;
