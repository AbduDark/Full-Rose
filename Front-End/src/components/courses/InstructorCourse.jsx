import React from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaPhone } from "react-icons/fa";

function InstructorCourse({ course }) {
  const { t } = useTranslation();

  if (!course || !course.instructor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {t("instructorCourse.noInstructorInfo")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center">
          <img
            src={course.instructor.image || "/default-instructor.jpg"}
            alt={t("instructorCourse.instructor")}
            className="w-full rounded-lg max-h-80 object-cover"
          />
        </div>
        <div className="flex items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {course.instructor.name}
            </h2>
            <p className="text-gray-500 text-lg mb-6">
              {course.instructor.specialization ||
                t("instructorCourse.instructor")}
            </p>

            <ul className="space-y-3">
              {course.instructor.phone && (
                <li className="flex items-center">
                  <FaPhone className="text-pink-600 mr-3" />
                  <a
                    href={`tel:${course.instructor.phone}`}
                    className="hover:text-pink-600"
                  >
                    {course.instructor.phone}
                  </a>
                </li>
              )}
              {course.instructor.email && (
                <li className="flex items-center">
                  <FaEnvelope className="text-pink-600 mr-3" />
                  <a
                    href={`mailto:${course.instructor.email}`}
                    className="hover:text-pink-600"
                  >
                    {course.instructor.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorCourse;
