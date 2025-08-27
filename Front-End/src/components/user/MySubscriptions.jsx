import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getMySubscriptions,
  cancelSubscription,
  renewSubscription,
} from "../../api/subscriptions";
import { useAuth } from "../../context/AuthContext";

const MySubscriptions = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRenewForm, setShowRenewForm] = useState(null);
  const [renewData, setRenewData] = useState({
    vodafone_number: "",
    parent_phone: "",
  });
  useEffect(() => {
    if (!token) {
      setError(t("mySubscriptions.error.login"));
      setLoading(false);
      navigate("/auth/login");
      return;
    }

    const fetchSubscriptions = async () => {
      try {
        const data = await getMySubscriptions(token);
        setSubscriptions(data?.data?.subscriptions || []);
      } catch (err) {
        setError(err.message || t("mySubscriptions.error.fetchFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [token, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm(t("common.confirm"))) {
      return;
    }

    setActionLoading(subscriptionId);
    try {
      await cancelSubscription(token, subscriptionId);
      // Refresh subscriptions
      const data = await getMySubscriptions(token);
      setSubscriptions(data?.data?.subscriptions || []);
    } catch (err) {
      setError(err.message || t("common.error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenewSubscription = async (subscriptionId) => {
    setActionLoading(subscriptionId);
    try {
      const renewalPayload = {
        subscription_id: subscriptionId,
        vodafone_number: renewData.vodafone_number,
        amount: parseFloat(
          subscriptions.find((s) => s.id === subscriptionId)?.course?.price || 0
        ),
        parent_phone: renewData.parent_phone,
      };

      await renewSubscription(token, renewalPayload);
      setShowRenewForm(null);
      setRenewData({ vodafone_number: "", parent_phone: "" });

      const data = await getMySubscriptions(token);
      setSubscriptions(data?.data?.subscriptions || []);
    } catch (err) {
      setError(err.message || t("common.error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenewInputChange = (e) => {
    setRenewData({
      ...renewData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">
          {t("mySubscriptions.title")}
        </h2>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-800 rounded-lg text-center">
            {error}
            {error.includes("log in") && (
              <a
                href="/auth/login"
                className="ml-2 text-indigo-600 hover:underline"
              >
                {t("auth.login.loginButton")}
              </a>
            )}
          </div>
        )}

        {loading && !error ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 transition-all duration-300"></div>
          </div>
        ) : subscriptions.length === 0 && !error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-xl text-gray-600 font-medium">
              {t("mySubscriptions.noSubscriptions")}.{" "}
              {t("mySubscriptions.explore")}
            </p>
            <a
              href="/courses"
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-semibold"
            >
              {t("mySubscriptions.explore")}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">
                  <div
                    className="h-40 w-full rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    {sub.course?.image_url ? (
                      <img
                        src={sub.course.image_url}
                        alt={sub.course.title}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400 text-lg font-medium">
                        {sub.course?.title || t("cardCourse.error")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {sub.course?.title || t("cardCourse.error")}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        sub.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sub.status
                        ? sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)
                        : t("common.error")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">
                      {t("mySubscriptions.instructor")}:
                    </span>{" "}
                    {sub.course?.instructor_name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("mySubscriptions.level")}:
                    </span>{" "}
                    {sub.course?.level
                      ? sub.course.level.charAt(0).toUpperCase() +
                        sub.course.level.slice(1)
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("mySubscriptions.duration")}:
                    </span>{" "}
                    {sub.course?.duration_hours
                      ? `${sub.course.duration_hours} ${t("cardCourse.hours")}`
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("mySubscriptions.price")}:
                    </span>{" "}
                    {sub.course?.price ? `$${sub.course.price}` : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("mySubscriptions.subscribed")}:
                    </span>{" "}
                    {sub.subscribed_at ? formatDate(sub.subscribed_at) : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("mySubscriptions.expires")}:
                    </span>{" "}
                    {sub.expires_at ? formatDate(sub.expires_at) : "N/A"}
                  </p>
                </div>
                <div className="mt-6 space-y-2">
                  <a
                    href={`/courses/${sub.course_id}`}
                    className="inline-block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-semibold"
                  >
                    {t("mySubscriptions.viewCourse")}
                  </a>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* {sub.status === "approved" && sub.is_active && (
                      <button
                        onClick={() => handleCancelSubscription(sub.id)}
                        disabled={actionLoading === sub.id}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-semibold disabled:opacity-50"
                      >
                        {actionLoading === sub.id ? "Canceling..." : "Cancel"}
                      </button>
                    )} */}

                    {sub.status === "approved" && (
                      <button
                        onClick={() =>
                          setShowRenewForm(
                            showRenewForm === sub.id ? null : sub.id
                          )
                        }
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-semibold"
                      >
                        {t("common.save")}
                      </button>
                    )}
                  </div>

                  {showRenewForm === sub.id && (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">
                        {t("enrollCourse.confirmSubscription")}
                      </h5>
                      <div className="space-y-2">
                        <input
                          type="tel"
                          name="vodafone_number"
                          value={renewData.vodafone_number}
                          onChange={handleRenewInputChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder={t("enrollCourse.vodafonePlaceholder")}
                          required
                        />
                        <input
                          type="tel"
                          name="parent_phone"
                          value={renewData.parent_phone}
                          onChange={handleRenewInputChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder={t("enrollCourse.parentPhonePlaceholder")}
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRenewSubscription(sub.id)}
                            disabled={actionLoading === sub.id}
                            className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
                          >
                            {actionLoading === sub.id
                              ? t("enrollCourse.processing")
                              : t("enrollCourse.confirmSubscription")}
                          </button>
                          <button
                            onClick={() => setShowRenewForm(null)}
                            className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-sm font-semibold"
                          >
                            {t("common.cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;
