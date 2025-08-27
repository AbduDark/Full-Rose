import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import CardCourse from "../courses/CardCourse";
import { useTranslation } from "react-i18next";

const PopularCoursesSection = () => {
  const { t, i18n } = useTranslation("common");
  return (
    <section
      id="popular-course-section"
      className={`pb-12 ${
        i18n.language === "ar" ? "font-arabic" : "font-['Heebo']"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Section head */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            {t("popularCourses.title")}
          </h1>
        </div>
        <p className="text-lg text-gray-500 mb-8">
          {t("popularCourses.subtitle")}
        </p>
      </div>

      {/* Courses */}
      <div className="container mx-auto px-4">
        <CardCourse />
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="group px-8 py-3 transition-all duration-300 flex items-center mx-auto gap-2 inline-flex items-center rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 px-8 py-3 text-lg font-medium shadow-md hover:bg-primary hover:from-transparent hover:to-transparent hover:text-white transition-all duration-300 ease-in-out "
          >
            {t("popularCourses.more")}
            <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCoursesSection;
