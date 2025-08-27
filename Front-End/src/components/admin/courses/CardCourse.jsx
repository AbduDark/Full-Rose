import React from "react";
import { FiBook, FiClock, FiEdit, FiTrash2, FiStar } from "react-icons/fi";

function CardCourse({ course, onEdit, onDelete }) {
  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-orange-100 text-orange-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return level;
    }
  };

  const getLanguageText = (language) => {
    switch (language) {
      case "ar":
        return "Arabic";
      case "en":
        return "English";
      default:
        return language;
    }
  };
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-gray-600">
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            course.image_url ||
            "https://via.placeholder.com/400x200?text=Course+Image"
          }
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(
              course.level
            )}`}
          >
            {getLevelText(course.level)}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-900/80 text-white">
            {getLanguageText(course.language)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {course.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-400">
            <FiStar className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-300">
              {parseFloat(course.avg_rating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <FiClock className="w-4 h-4" />
            <span className="text-sm">{course.duration_hours} hours</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <FiBook className="w-4 h-4" />
            <span className="text-sm">{course.lessons_count} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-300">
            <span className="text-lg font-semibold">${course.price}</span>
          </div>
          <div className="text-sm text-gray-400">
            by {course.instructor_name}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                course.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {course.is_active ? "Active" : "Inactive"}
            </span>
            {course.grade && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                {course.grade}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(course)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title="Edit course"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete course"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardCourse;
