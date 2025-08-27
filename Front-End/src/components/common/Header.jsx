import { useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { MdSubscriptions } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Rose_Logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { IoNotificationsSharp } from "react-icons/io5";
import { useNotifications } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import i18n from "../../i18n/index.js";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { t } = useTranslation("common");
  const location = useLocation();

  const isActiveLink = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getActiveLinkClasses = (isActive) => {
    return isActive
      ? "px-4 py-2 text-violet-600 font-[600] text-base border-b-2 bg-violet-50 rounded-t-lg shadow-sm transition-all duration-300"
      : "px-4 py-2 text-gray-100 font-[500] text-base hover:bg-violet-900/20 rounded-t-lg transition-all duration-300";
  };

  const getActiveMobileLinkClasses = (isActive) => {
    return isActive
      ? "block px-4 py-3 text-indigo-600 font-semibold border-l-4 border-indigo-600 bg-indigo-50 rounded-r-lg shadow-sm transition-all duration-300"
      : "block px-4 py-3 text-gray-900 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-lg transition-all duration-300";
  };

  const handleLogout = async () => {
    try {
      logout();
      setIsMenuOpen(false);
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      dir="ltr"
      className="sticky top-0 flex-nowrap z-50 shadow-md bg-gradient-to-r from-secondary/80 to-primary/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              className="navbar-brand flex items-center h-full"
              onClick={() => setIsMenuOpen(false)}
              to="/"
            >
              <img src={Logo} alt="Logo" className="h-11 max-h-11 w-auto" />
            </Link>
            <h4 className="text-md font-semibold text-gray-800">Rose</h4>{" "}
          </div>
          {/* Mobile menu button */}
          <button
            className="md:hidden ml-auto rounded-md p-2 text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            <div className="space-y-2">
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-all ${
                  isMenuOpen ? "rotate-45 transform origin-top-left" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-gray-600 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-all ${
                  isMenuOpen ? "-rotate-45 transform origin-bottom-left" : ""
                }`}
              ></span>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:w-full">
            <ul
              className={`navbar-nav mx-auto mb-xl-0 flex space-x-4 ${
                i18n.language === "ar" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <li className="nav-item">
                <Link
                  className={getActiveLinkClasses(isActiveLink("/"))}
                  to="/"
                >
                  {t("header.home")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getActiveLinkClasses(isActiveLink("/courses"))}
                  to="/courses"
                >
                  {t("header.courses")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getActiveLinkClasses(isActiveLink("/about"))}
                  to="/about"
                >
                  {t("header.about")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getActiveLinkClasses(isActiveLink("/contact"))}
                  to="/contact"
                >
                  {t("header.contact")}
                </Link>
              </li>
            </ul>

            <div className="hidden md:flex items-center">
              <LanguageSwitcher />
            </div>

            {/* User Dropdown */}
            <div className="user-dropdown flex items-center ml-8 text-white relative">
              {user ? (
                <>
                  <Link
                    to="/notifications"
                    className="rounded-full text-2xl mr-6 relative"
                    title={t("header.notifications")}
                  >
                    <IoNotificationsSharp />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    className="rounded-full text-2xl"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <FaCircleUser />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  className="bg-white text-primary hover:bg-purple-100 hover:text-primary px-4 py-2 rounded-md text-sm font-semibold transition duration-200"
                >
                  {t("header.login")}
                </Link>
              )}
              {isUserDropdownOpen && (
                <ul className="dropdown-menu absolute right-0 top-8 mt-2 w-56 bg-white shadow-lg rounded-md py-1 z-50 border-b-2 border-secondary">
                  <li>
                    <h4 className="dropdown-header px-4 py-2 text-sm font-bold text-center text-gray-700">
                      {user?.name || "User"}
                    </h4>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1 border-gray-300" />
                  </li>
                  {user?.role === "student" ? (
                    <>
                      <li>
                        <Link
                          to="/student-dashboard/subscriptions"
                          className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <MdSubscriptions className="mr-3" />
                          {t("header.subscriptions")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/student-dashboard/profile"
                          className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <FaUser className="mr-3" />
                          {t("header.profile")}
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        to="/admin/overview"
                        className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <MdSubscriptions className="mr-3" />
                        {t("header.dashboard")}
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider my-1 border-gray-300" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" />
                      {t("header.logout")}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-4 shadow-lg">
              <Link
                to="/"
                className={getActiveMobileLinkClasses(isActiveLink("/"))}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.home")}
              </Link>
              <Link
                to="/courses"
                className={getActiveMobileLinkClasses(isActiveLink("/courses"))}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.courses")}
              </Link>
              <Link
                to="/about"
                className={getActiveMobileLinkClasses(isActiveLink("/about"))}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.about")}
              </Link>
              <Link
                to="/contact"
                className={getActiveMobileLinkClasses(isActiveLink("/contact"))}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("header.contact")}
              </Link>

              {/* Language Toggle for Mobile */}
              <div className="px-4 py-3">
                <LanguageSwitcher className="w-full" />
              </div>

              {/* User Actions for Mobile */}
              {user ? (
                <div className="px-4 py-3 space-y-2">
                  {user.role === "student" ? (
                    <>
                      <Link
                        to="/student-dashboard/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("header.profile")}
                      </Link>
                      <Link
                        to="/student-dashboard/subscriptions"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("header.subscriptions")}
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/admin/overview"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("header.dashboard")}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {t("header.logout")}
                  </button>
                </div>
              ) : (
                <div className="px-4 py-3">
                  <Link
                    to="/auth/login"
                    className="block w-full text-center bg-primary text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("header.login")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
