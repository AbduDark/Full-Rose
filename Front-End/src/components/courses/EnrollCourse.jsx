import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBook, FaClock, FaGraduationCap, FaMoneyCheck } from "react-icons/fa";
import { getCourseById } from "../../api/courses";
import {
  subscribeToCourse,
  getSubscriptionStatus,
} from "../../api/subscriptions";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import i18next from "i18next";

function EnrollCourse() {
  const { t } = useTranslation();
  const [enrollError, setEnrollError] = useState(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    vodafone_number: "",
    amount: "",
    parent_phone: "",
    student_info: "",
  });
  const { courseId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      try {
        setLoading(true);
        const courseRes = await getCourseById(courseId);
        setCourse(courseRes.data);
        if (token) {
          try {
            const statusRes = await getSubscriptionStatus(token, courseId);
            setSubscriptionStatus(statusRes.data);
          } catch (err) {
            console.log("No subscription found for this course");
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndStatus();
  }, [courseId, token]);
  if (!course) {
    return;
  }
  const handleEnroll = async () => {
    if (!token) {
      setEnrollError(t("enrollCourse.enrollError"));
      return;
    }

    setEnrolling(true);
    setEnrollError(null);
    setEnrollSuccess(false);

    try {
      const subscriptionPayload = {
        course_id: parseInt(courseId),
        vodafone_number: subscriptionData.vodafone_number,
        amount: parseFloat(subscriptionData.amount),
        parent_phone: subscriptionData.parent_phone,
        student_info: subscriptionData.student_info,
      };

      await subscribeToCourse(token, subscriptionPayload);
      setEnrollSuccess(true);
      setShowSubscriptionForm(false);

      try {
        const statusRes = await getSubscriptionStatus(token, courseId);
        setSubscriptionStatus(statusRes.data);
      } catch (err) {
        console.log("Error refreshing subscription status");
      }
    } catch (error) {
      setEnrollError(
        error.message || "Failed to enroll in course. Please try again."
      );
    } finally {
      setEnrolling(false);
    }
  };

  const handleInputChange = (e) => {
    setSubscriptionData({
      ...subscriptionData,
      [e.target.name]: e.target.value,
    });
  };
  if (loading) {
    return;
  }

  return (
    <div>
      {/* COURSE CARD */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <img src={course.image_url} alt="Course Thumbnail" className="w-full" />
        <div className="p-4">
          {enrollError && (
            <p className="text-red-500 text-sm mb-3">{enrollError}</p>
          )}
          {enrollSuccess && (
            <p className="text-green-500 text-sm mb-3">
              {t("enrollCourse.enrollSuccess")}
            </p>
          )}

          {/* Subscription Status Display */}
          {/* {subscriptionStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Subscription Status
              </h4>
              <div className="text-sm text-blue-700">
                <p>
                  <strong>Status:</strong>{" "}
                  {subscriptionStatus.subscription_status}
                </p>
                {subscriptionStatus.days_remaining !== undefined && (
                  <p>
                    <strong>Days Remaining:</strong>{" "}
                    {Math.ceil(subscriptionStatus.days_remaining)}
                  </p>
                )}
                {subscriptionStatus.is_expired && (
                  <p className="text-red-600 font-semibold">
                    Subscription has expired
                  </p>
                )}
              </div>
            </div>
          )} */}

          {/* Subscription Form */}
          {showSubscriptionForm && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">
                {t("enrollCourse.subscriptionDetails")}
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("enrollCourse.vodafoneNumber")}
                  </label>
                  <input
                    type="tel"
                    name="vodafone_number"
                    value={subscriptionData.vodafone_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder={t("enrollCourse.vodafonePlaceholder")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("enrollCourse.amount")}
                  </label>
                  <input
                    type="text"
                    name="amount"
                    value={subscriptionData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder={t("enrollCourse.amountPlaceholder")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("enrollCourse.parentPhone")}
                  </label>
                  <input
                    type="tel"
                    name="parent_phone"
                    value={subscriptionData.parent_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder={t("enrollCourse.parentPhonePlaceholder")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("enrollCourse.studentInfo")}
                  </label>
                  <textarea
                    name="student_info"
                    value={subscriptionData.student_info}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder={t("enrollCourse.studentInfoPlaceholder")}
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}

          {!subscriptionStatus?.subscription?.is_active ? (
            <button
              onClick={() => setShowSubscriptionForm(!showSubscriptionForm)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg flex items-center justify-center mb-3"
            >
              <FaGraduationCap
                className={`${i18next.language === "ar" ? "ml-2" : "mr-2"}`}
              />
              {showSubscriptionForm
                ? t("enrollCourse.cancel")
                : t("enrollCourse.enrollNow")}
            </button>
          ) : null}

          {showSubscriptionForm && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <FaGraduationCap
                className={`${i18next.language === "ar" ? "ml-2" : "mr-2"}`}
              />
              {enrolling
                ? t("enrollCourse.processing")
                : t("enrollCourse.confirmSubscription")}
            </button>
          )}
        </div>
      </div>

      {/* COURSE DETAILS */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">
          {t("enrollCourse.courseIncludes")}
        </h3>
        <ul className="space-y-3">
          <li className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <FaMoneyCheck
                className={`text-pink-600 ${i18next.language === "ar" ? "ml-3" : "mr-3"}`}
              />
              <span>{t("enrollCourse.price")}</span>
            </div>
            <span className="text-gray-500">{course.price}</span>
          </li>
          <li className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <FaBook
                className={`text-pink-600 ${i18next.language === "ar" ? "ml-3" : "mr-3"}`}
              />
              <span>{t("enrollCourse.episodes")}</span>
            </div>
            <span className="text-gray-500">{course.lessons_count}</span>
          </li>
          <li className="border-t border-gray-100"></li>
          <li className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <FaClock
                className={`text-pink-600 ${ i18next.language === "ar" ? "ml-3" : "mr-3"}`}
              />
              <span>{t("enrollCourse.date")}</span>
            </div>
            <span className="text-gray-500">
              {course.created_at.split("T")[0]}
            </span>
          </li>
          <li className="border-t border-gray-100"></li>
        </ul>
      </div>
    </div>
  );
}

export default EnrollCourse;
