import React from "react";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";

function SearchUser({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedGender,
  setSelectedGender,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <FiSearch className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t("adminDashboard.searchUser.searchPlaceholder")}
          className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Role Filter */}
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">{t("adminDashboard.userManager.allRoles")}</option>
        <option value="admin">{t("adminDashboard.cardUser.admin")}</option>
        <option value="student">{t("adminDashboard.cardUser.student")}</option>
      </select>

      {/* Gender Filter */}
      <select
        value={selectedGender}
        onChange={(e) => setSelectedGender(e.target.value)}
        className="px-4 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">
          {t("adminDashboard.userManager.allGenders")}
        </option>
        <option value="male">{t("adminDashboard.cardUser.male")}</option>
        <option value="female">{t("adminDashboard.cardUser.female")}</option>
      </select>
    </div>
  );
}

export default SearchUser;
