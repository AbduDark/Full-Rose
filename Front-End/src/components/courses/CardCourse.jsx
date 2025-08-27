import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaStar, FaStarHalfAlt, FaRegStar, FaClock } from "react-icons/fa";
import { useCourse } from "../../context/CourseContext";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import i18next from "i18next";

function CardCourse() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;
  const { courses, loading, error } = useCourse();
  const navigate = useNavigate();

  const filteredCourses = courses.filter(
    (course) => category === "" || course.level === category
  );
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );
  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const renderStars = (rating) => {
    if (!rating)
      return <span className="text-gray-400">{t("cardCourse.noRating")}</span>;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center my-9 text-red-600">
        {t("cardCourse.error")}: {error}
      </div>
    );

  return (
    <div className="container mx-auto py-12 px-4">
      <div
        className={`grid ${
          viewMode === "list"
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        } gap-6`}
      >
        {paginatedCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleCourseClick(course.id)}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <img
              src={course.image_url || "/default-course.jpg"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.level}
                </span>
                <span className="text-xs text-gray-500">{course.language}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <div className="flex items-center mb-3">
                {renderStars(course.avg_rating)}
                <span className="text-gray-600 text-sm ml-2">
                  {course.avg_rating ? `${course.avg_rating}/5` : ""}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <FaClock
                    className={`text-red-500 ${
                      i18next.language === "ar" ? "ml-1" : "mr-1"
                    }`}
                  />
                  {course.duration_hours} {t("cardCourse.hours")}
                </span>
                <span>
                  {course.lessons_count} {t("cardCourse.lessons")}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {t("cardCourse.instructor")}: {course.instructor_name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardCourse;
