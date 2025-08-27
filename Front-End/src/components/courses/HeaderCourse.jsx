import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaStar,
  FaGraduationCap,
  FaInfoCircle,
  FaUserCircle,
} from "react-icons/fa";
import { getCourseById } from "../../api/courses";
import { useParams } from "react-router-dom";
import Loader from "../common/Loader";
import i18next from "i18next";

function HeaderCourse() {
  const { t } = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();

  useEffect(() => {
    getCourseById(courseId)
      .then((res) => setCourse(res.data))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return;
  }
  if (!course) {
    return (
      <div className="py-8 text-center text-white bg-gradient-to-r from-secondary to-primary">
        {t("courseDetailPage.courseNotFound")}
      </div>
    );
  }

  return (
    <div className="py-8 pb-0 mb-0 text-white bg-gradient-to-r from-secondary to-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center bg-white/25 text-white rounded-full px-3 py-1 w-fit mb-4">
          {course.level}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg mb-6 max-w-3xl">{course.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <FaStar
              className={`${i18next.language === "ar" ? "ml-1" : "mr-1"}`}
            />
            <span>{parseFloat(course.avg_rating).toFixed(1)}/5.0</span>
          </div>
          <div className="flex items-center">
            <FaGraduationCap
              className={`${i18next.language === "ar" ? "ml-1" : "mr-1"}`}
            />
            <span>
              {course.lessons_count}+ {t("cardCourse.lessons")}
            </span>
          </div>
          <div className="flex items-center">
            <FaInfoCircle
              className={`${i18next.language === "ar" ? "ml-1" : "mr-1"}`}
            />
            <span>
              {t("headerCourse.lastUpdated")}:{" "}
              {new Date(course.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center mb-8">
          {course?.image_url ? (
            <img
              src={course?.image_url}
              alt="Instructor"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <FaUserCircle className="text-2xl" />
          )}
          <div className="ml-3">
            <h3 className="text-white font-medium">{course.instructor_name}</h3>
          </div>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full block"
      >
        <path
          fill="#FFFFFF"
          fillOpacity="1"
          d="M0,256L48,240C96,224,192,192,288,154.7C384,117,480,75,576,96C672,117,768,203,864,197.3C960,192,1056,96,1152,69.3C1248,43,1344,85,1392,106.7L1440,128L1440,320L1440,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  );
}

export default HeaderCourse;
