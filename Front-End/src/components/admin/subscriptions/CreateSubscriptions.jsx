import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

function CreateSubscriptions({ onSubscriptionCreated, isOpen, onClose }) {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    user_id: "",
    course_id: "",
    vodafone_number: "",
    parent_phone: "",
    student_info: "",
    status: "pending",
  });

  // Fetch users and courses on component mount
  useEffect(() => {
    if (isOpen) {
      // In a real implementation, you would fetch users and courses from API
      // For now, we'll use mock data
      setUsers([
        { id: 1, name: "Student 1", email: "student1@example.com" },
        { id: 2, name: "Student 2", email: "student2@example.com" },
        { id: 3, name: "Student 3", email: "student3@example.com" },
      ]);

      setCourses([
        { id: 1, title: "Programming Basics", price: "99.99" },
        { id: 2, title: "Web Development", price: "149.99" },
        { id: 3, title: "Database Design", price: "129.99" },
      ]);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For now, we'll just simulate subscription creation since the API endpoint wasn't provided
      // In a real implementation, you would call the create subscription API here
      const newSubscription = {
        id: Date.now(), // Temporary ID
        ...formData,
        subscribed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: false,
        is_approved: false,
        expires_at: null,
        approved_at: null,
        rejected_at: null,
        approved_by: null,
        rejected_by: null,
        admin_notes: null,
        user: users.find((u) => u.id.toString() === formData.user_id),
        course: courses.find((c) => c.id.toString() === formData.course_id),
      };

      onClose();
      if (onSubscriptionCreated) {
        onSubscriptionCreated(newSubscription);
      }
    } catch (err) {
      setError(
        t("adminDashboard.createSubscription.createError") + ": " + err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t("adminDashboard.createSubscription.title")}
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

        <form onSubmit={handleCreateSubscription}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* User Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.selectUser")} *
              </label>
              <select
                name="user_id"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.user_id}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  {t("adminDashboard.createSubscription.selectUser")}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.selectCourse")} *
              </label>
              <select
                name="course_id"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.course_id}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  {t("adminDashboard.createSubscription.selectCourse")}
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} - ${course.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Vodafone Number */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.vodafoneNumber")} *
              </label>
              <input
                type="tel"
                name="vodafone_number"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.vodafone_number}
                onChange={handleInputChange}
                required
                placeholder={t(
                  "adminDashboard.createSubscription.vodafonePlaceholder"
                )}
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.parentPhone")}
              </label>
              <input
                type="tel"
                name="parent_phone"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.parent_phone}
                onChange={handleInputChange}
                placeholder={t(
                  "adminDashboard.createSubscription.parentPhonePlaceholder"
                )}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.status")} *
              </label>
              <select
                name="status"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">
                  {t("adminDashboard.createSubscription.pending")}
                </option>
                <option value="approved">
                  {t("adminDashboard.createSubscription.approved")}
                </option>
                <option value="rejected">
                  {t("adminDashboard.createSubscription.rejected")}
                </option>
              </select>
            </div>

            {/* Student Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createSubscription.studentInfo")}
              </label>
              <textarea
                name="student_info"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.student_info}
                onChange={handleInputChange}
                placeholder={t(
                  "adminDashboard.createSubscription.studentInfoPlaceholder"
                )}
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? t("adminDashboard.createSubscription.creating")
                : t("adminDashboard.createSubscription.createButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSubscriptions;
