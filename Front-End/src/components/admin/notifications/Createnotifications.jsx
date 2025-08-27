import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiUsers, FiBook } from "react-icons/fi";
import { sendNotification } from "../../../api/notifications";
import { getCourses } from "../../../api/courses";
import { useAuth } from "../../../context/AuthContext";

function CreateNotification({ onNotificationSent, isOpen, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
    user_ids: [],
    course_id: "",
    send_to_all: true,
    gender: "",
    data: {
      lesson_id: "",
      url: "",
    },
  });

  // Fetch courses for course notifications
  useEffect(() => {
    if (formData.type === "course") {
      fetchCourses();
    }
  }, [formData.type]);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "send_to_all") {
      setFormData((prev) => ({
        ...prev,
        send_to_all: checked,
        user_ids: checked ? [] : prev.user_ids,
      }));
    } else if (name === "lesson_id" || name === "url") {
      setFormData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const notificationData = {
        ...formData,
        // user_ids: formData.send_to_all ? [] : selectedUsers,
        user_ids: (formData.send_to_all = []),
        course_id:
          formData.type === "course" ? parseInt(formData.course_id) : null,
        data: {
          lesson_id: formData.data.lesson_id
            ? parseInt(formData.data.lesson_id)
            : null,
          url: formData.data.url || null,
        },
      };

      // Remove empty fields
      if (!notificationData.gender) delete notificationData.gender;
      if (!notificationData.data.lesson_id)
        delete notificationData.data.lesson_id;
      if (!notificationData.data.url) delete notificationData.data.url;

      const response = await sendNotification(notificationData);

      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "general",
        user_ids: [],
        course_id: "",
        send_to_all: false,
        gender: "",
        data: {
          lesson_id: "",
          url: "",
        },
      });
      setSelectedUsers([]);

      onClose();
      if (onNotificationSent) {
        onNotificationSent(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t("adminDashboard.createNotification.title")}
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

        <form onSubmit={handleSendNotification}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Notification Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createNotification.notificationTitle")} *
              </label>
              <input
                type="text"
                name="title"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder={t("adminDashboard.createNotification.enterTitle")}
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createNotification.message")} *
              </label>
              <textarea
                name="message"
                rows="3"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder={t(
                  "adminDashboard.createNotification.enterMessage"
                )}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createNotification.type")} *
              </label>
              <select
                name="type"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="general">
                  {t("adminDashboard.createNotification.general")}
                </option>
                <option value="course">
                  {t("adminDashboard.createNotification.course")}
                </option>
                <option value="system">
                  {t("adminDashboard.createNotification.system")}
                </option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createNotification.gender")}
              </label>
              <select
                name="gender"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">
                  {t("adminDashboard.createNotification.allGenders")}
                </option>
                <option value="male">
                  {t("adminDashboard.createNotification.male")}
                </option>
                <option value="female">
                  {t("adminDashboard.createNotification.female")}
                </option>
              </select>
            </div>

            {/* Course Selection (for course type) */}
            {formData.type === "course" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  {t("adminDashboard.createNotification.course")} *
                </label>
                <select
                  name="course_id"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">
                    {t("adminDashboard.createNotification.selectCourse")}
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Send to All */}
            {/*
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="send_to_all"
                  checked={formData.send_to_all}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-300">
                  Send to all users
                </span>
              </label>
            </div>
            // Individual User Selection (when not sending to all) 
            {!formData.send_to_all && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Select Users
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-gray-700">
                  // Mock users - in real app, you'd fetch users from API 
                  {[1, 2, 3, 4, 5].map((userId) => (
                    <label
                      key={userId}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userId)}
                        onChange={() => handleUserSelection(userId)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">
                        User {userId}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            */}
            {/* Additional Data */}
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium mb-2 text-gray-300">
                {t("adminDashboard.createNotification.additionalData")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t("adminDashboard.createNotification.lessonId")}
                  </label>
                  <input
                    type="number"
                    name="lesson_id"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.data.lesson_id}
                    onChange={handleInputChange}
                    placeholder={t(
                      "adminDashboard.createNotification.optionalLessonId"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {t("adminDashboard.createNotification.url")}
                  </label>
                  <input
                    type="url"
                    name="url"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.data.url}
                    onChange={handleInputChange}
                    placeholder={t(
                      "adminDashboard.createNotification.optionalUrl"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("adminDashboard.createNotification.cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? t("adminDashboard.createNotification.sending")
                : t("adminDashboard.createNotification.sendNotification")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNotification;
