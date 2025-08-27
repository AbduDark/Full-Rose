import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiMonitor,
  FiBarChart2,
  FiUser,
  FiMenu,
  FiHome,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import CoursesManager from "../components/admin/courses/CoursesManager";
import { IoIosNotifications } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import NotificationsManager from "../components/admin/notifications/notificationsManager";
import DashboardOverview from "../components/admin/overview/DashboardOverview";
import UserManager from "../components/admin/user/UserManager";
import { FaMoneyCheck } from "react-icons/fa";
import SubscriptionsManager from "../components/admin/subscriptions/SubscriptionsManager";
import i18next from "i18next";

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [i18next.language]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const avatarMenu = document.querySelector("[data-avatar-menu]");
      if (avatarMenuOpen && avatarMenu && !avatarMenu.contains(event.target)) {
        setAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  const menuItems = [
    { id: "overview", label: t("adminDashboard.overview"), icon: FiBarChart2 },
    { id: "courses", label: t("adminDashboard.courses"), icon: FiBookOpen },
    { id: "lessons", label: t("adminDashboard.lessons"), icon: FiMonitor },
    {
      id: "subscriptions",
      label: t("adminDashboard.subscriptions"),
      icon: FaMoneyCheck,
    },
    { id: "users", label: t("adminDashboard.users"), icon: FiUser },
    {
      id: "notifications",
      label: t("adminDashboard.notifications"),
      icon: IoIosNotifications,
    },
  ];

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
      setMobileSidebarOpen(false);
    }
  }, [tab]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );

    const contentMap = {
      overview: <DashboardOverview />,
      courses: <CoursesManager />,
      lessons: <CoursesManager />,
      subscriptions: <SubscriptionsManager />,
      users: <UserManager />,
      notifications: <NotificationsManager />,
    };

    return contentMap[activeTab] || contentMap.courses;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className={`md:hidden fixed top-4 z-50 p-2 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition-colors ${
          i18next.language === "ar" ? "right-4" : "left-4"
        }`}
      >
        <FiMenu className="w-5 h-5 text-gray-300" />
      </button>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
         ${sidebarCollapsed ? "w-20" : "w-64"}
         ${
           mobileSidebarOpen
             ? "translate-x-0"
             : i18next.language === "ar"
             ? "translate-x-full md:translate-x-0"
             : "-translate-x-full md:translate-x-0"
         }
         fixed md:relative z-50 h-full bg-gray-800 transition-all duration-300 flex flex-col
         ${
           i18next.language === "ar"
             ? "right-0 border-l border-gray-700"
             : "left-0 border-r border-gray-700"
         }
       `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!sidebarCollapsed && (
            <div
              className={`flex items-center ${
                i18next.language === "ar"
                  ? "space-x-reverse space-x-2"
                  : "space-x-2"
              }`}
            >
              <FiBookOpen className="text-blue-400 w-6 h-6" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                EduAdmin
              </h1>
            </div>
          )}
          <div
            className={`flex items-center ${
              i18next.language === "ar"
                ? "space-x-reverse space-x-2"
                : "space-x-2"
            }`}
          >
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-gray-700 rounded text-gray-300"
            >
              {i18next.language === "ar" ? (
                <FiChevronRight className="w-5 h-5" />
              ) : (
                <FiChevronLeft className="w-5 h-5" />
              )}
            </button>
            {/* Desktop Collapse Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:block p-1 hover:bg-gray-700 rounded"
            >
              {sidebarCollapsed ? (
                <FiChevronRight className="w-5 h-5" />
              ) : (
                <FiChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                navigate(`/admin/${id}`);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === id
                  ? "bg-gradient-to-r from-secondary to-primary text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  sidebarCollapsed
                    ? "mx-auto"
                    : i18next.language === "ar"
                    ? "ml-3"
                    : "mr-3"
                }`}
              />
              {!sidebarCollapsed && label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex p-3 text-gray-300 hover:bg-gray-700 rounded-lg"
          >
            <FiHome
              className={`w-5 h-5 ${
                sidebarCollapsed
                  ? "mx-0"
                  : i18next.dir() === "rtl"
                  ? "ml-3"
                  : "mr-3"
              }`}
            />
            {!sidebarCollapsed && t("adminDashboard.backToHome")}
          </Link>
          <button
            onClick={() => {
              handleLogout();
            }}
            className="flex items-center w-full justify-start p-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-1"
          >
            <FiLogOut
              className={`w-5 h-5 ${
                sidebarCollapsed
                  ? "mx-0"
                  : i18next.dir() === "rtl"
                  ? "ml-3"
                  : "mr-3"
              }`}
            />
            {!sidebarCollapsed && t("adminDashboard.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold hidden md:block">
            {menuItems.find((item) => item.id === activeTab)?.label ||
              t("adminDashboard.title")}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative" data-avatar-menu>
              <div
                className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 cursor-pointer"
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              >
                A
              </div>
              {avatarMenuOpen && (
                <div
                  className={`absolute mt-2 min-w-[180px] bg-white rounded-lg shadow-lg z-50 border border-gray-200 ${
                    i18next.language === "ar" ? "left-0" : "right-0"
                  }`}
                  onMouseLeave={() => setAvatarMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      navigate("/");
                      setAvatarMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full ${
                        i18next.language === "ar" ? "ml-2" : "mr-2"
                      }`}
                    >
                      <FiHome className="w-5 h-5 text-blue-600" />
                    </span>
                    Home
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setAvatarMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center bg-red-100 rounded-full ${
                        i18next.language === "ar" ? "ml-2" : "mr-2"
                      }`}
                    >
                      <FiLogOut className="w-5 h-5 text-red-600" />
                    </span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-900">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
