import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { updateAdminCourse } from "../../../api/courses";
import { useAuth } from "../../../context/AuthContext";

function UpdateCourse({ course, onCourseUpdated, isOpen, onClose }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration_hours: "",
    level: "beginner",
    language: "ar",
    instructor_name: "",
    is_active: "true",
    grade: "",
    image: null,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        duration_hours: course.duration_hours || "",
        level: course.level || "beginner",
        language: course.language || "ar",
        instructor_name: course.instructor_name || "",
        is_active: course.is_active ? "true" : "false",
        grade: course.grade || "",
        image: null,
      });
    }
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        duration_hours: parseInt(formData.duration_hours),
        is_active: formData.is_active === "true",
      };

      const response = await updateAdminCourse(
        course.id,
        courseData,
        user.token
      );

      onClose();
      if (onCourseUpdated) {
        onCourseUpdated(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Edit Course</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateCourse}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Course Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter course title"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Description *
              </label>
              <textarea
                name="description"
                rows="3"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter course description"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Price *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </div>

            {/* Duration Hours */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Duration (Hours) *
              </label>
              <input
                type="number"
                name="duration_hours"
                min="1"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.duration_hours}
                onChange={handleInputChange}
                required
                placeholder="20"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Level *
              </label>
              <select
                name="level"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Language *
              </label>
              <select
                name="language"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.language}
                onChange={handleInputChange}
                required
              >
                <option value="ar">Arabic</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Instructor Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Instructor Name *
              </label>
              <input
                type="text"
                name="instructor_name"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.instructor_name}
                onChange={handleInputChange}
                required
                placeholder="Enter instructor name"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Grade
              </label>
              <input
                type="text"
                name="grade"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.grade}
                onChange={handleInputChange}
                placeholder="e.g., الأول، الثاني"
              />
            </div>

            {/* Is Active */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Status
              </label>
              <select
                name="is_active"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.is_active}
                onChange={handleInputChange}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Course Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
              />
              {formData.image && (
                <p className="mt-2 text-sm text-gray-400">
                  Selected: {formData.image.name}
                </p>
              )}
              {course.image_url && !formData.image && (
                <p className="mt-2 text-sm text-gray-400">
                  Current image: {course.image_url}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
