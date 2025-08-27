import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

function CardUser({ user, onEdit, onDelete }) {
  const { t } = useTranslation();

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "student":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return t("adminDashboard.cardUser.admin");
      case "student":
        return t("adminDashboard.cardUser.student");
      default:
        return role;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case "male":
        return "bg-blue-100 text-blue-800";
      case "female":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "male":
        return t("adminDashboard.cardUser.male");
      case "female":
        return t("adminDashboard.cardUser.female");
      default:
        return gender;
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

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-gray-600">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiUser className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white line-clamp-1">
                {user.name || t("adminDashboard.cardUser.unknownUser")}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleText(user.role)}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(
                    user.gender
                  )}`}
                >
                  {getGenderText(user.gender)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title={t("adminDashboard.cardUser.editUser")}
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(user)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title={t("adminDashboard.cardUser.deleteUser")}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <FiMail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {user.email || t("adminDashboard.cardUser.noEmail")}
            </span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2 text-gray-300">
              <FiPhone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-300">
            <FiClock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              {t("adminDashboard.cardSubscription.subscribed")}:{" "}
              {formatDate(user.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">
                {t("adminDashboard.subscriptions").toLowerCase()}:
              </span>
              <span className="text-blue-400 font-medium">
                {user.subscriptions_count}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Favorites:</span>
              <span className="text-purple-400 font-medium">
                {user.favorites_count}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user.email_verified_at ? (
              <div className="flex items-center gap-1 text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                <span className="text-xs">
                  {t("adminDashboard.cardUser.active")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-yellow-400">
                <FiXCircle className="w-4 h-4" />
                <span className="text-xs">
                  {t("adminDashboard.cardUser.inactive")}
                </span>
              </div>
            )}
          </div>

          {user.last_login_at && (
            <div className="text-xs text-gray-400">
              Last login: {formatDate(user.last_login_at)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardUser;
