import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiMenu, FiX, FiVideo } from "react-icons/fi";
import DeleteAccount from "../components/user/DeleteAccount";
import EditProfile from "../components/user/EditProfile";
import { getProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import ChangePassword from "../components/user/ChangePassword";
import { TbLockPassword } from "react-icons/tb";
import Loader from "../components/common/Loader";
import MySubscriptions from "../components/user/MySubscriptions";
import { useNavigate, useParams } from "react-router-dom";
import i18next from "i18next";

const StudentDashboardPage = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const { tab } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const currentTab = menuItems.find((item) => item.path === tab);
    if (currentTab) {
      setActiveTab(currentTab.id);
    } else {
      navigate(`${menuItems[0].path}`, { replace: true });
    }
  }, [tab]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError(t("studentDashboard.noAuthToken"));
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (error) {
        setError(error.message || t("studentDashboard.failedToLoadProfile"));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const menuItems = [
    {
      id: 1,
      label: t("studentDashboard.courses"),
      icon: <FiVideo className="w-5 h-5" />,
      component: <MySubscriptions />,
      path: "subscriptions",
    },
    {
      id: 2,
      label: t("studentDashboard.editProfile"),
      icon: <FiEdit className="w-5 h-5" />,
      component: <EditProfile profile={profile} />,
      path: "profile",
    },
    {
      id: 3,
      label: t("studentDashboard.changePassword"),
      icon: <TbLockPassword className="w-5 h-5" />,
      component: <ChangePassword />,
      path: "change-password",
    },
    // {
    //   id: 3,
    //   label: "Delete Account",
    //   icon: <FiTrash2 className="w-5 h-5" />,
    //   component: <DeleteAccount />,
    // },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabChange = (item) => {
    setActiveTab(item.id);
    navigate(`/student-dashboard/${item.path}`);
    if (window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center my-9 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4">
        <p className="text-gray-500">{t("studentDashboard.noProfileData")}</p>
      </div>
    );
  }

  const ActiveComponent = menuItems.find(
    (item) => item.id === activeTab
  )?.component;

  return (
    <section className="relative pb-8">
      <div className="h-28 bg-gradient-to-r from-secondary to-primary"></div>
      {/* Profile Head */}
      <div className="-mt-8 mb-6">
        <div className="container mx-auto px-4">
          <div className="bg-transparent shadow-none">
            <div className="flex flex-wrap items-center">
              <div className="w-auto">
                <div
                  className={`w-32 h-32 rounded-full bg-white p-1 border-4 border-gray-300 ${
                    i18next.language === "ar" ? "ml-4" : "mr-4"
                  }`}
                >
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mt-2 md:mt-0 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-800">
                      {profile.name || "User"}
                    </h2>
                  </div>
                  <div className="md:hidden">
                    <button
                      onClick={toggleMenu}
                      className="p-2 -mt-6 text-white bg-white/20 rounded-full hover:bg-white/30"
                    >
                      {menuOpen ? (
                        <FiX className="w-5 h-5" />
                      ) : (
                        <FiMenu className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-3">
          {/* Sidebar Navigation */}
          {menuOpen && (
            <div className="w-full md:w-1/4 px-3 mb-6">
              <div className="rounded-lg bg-gradient-to-r from-secondary to-primary p-4 shadow-lg">
                <nav>
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleTabChange(item)}
                          className={`w-full flex items-center p-[11px] rounded transition-colors ${
                            activeTab === item.id
                              ? "bg-white text-gray-900"
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <span
                            className={`${
                              i18next.language === "ar" ? "ml-3" : "mr-3"
                            } ${
                              activeTab === item.id
                                ? "text-primary"
                                : "text-white"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-semibold">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          )}
          <div className={`px-2 ${menuOpen ? "w-full md:w-3/4" : "w-full"}`}>
            {ActiveComponent || <p>{t("studentDashboard.selectTabToView")}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboardPage;
