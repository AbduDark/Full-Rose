import React from "react";
import { useTranslation } from "react-i18next";
import SingleCourse from "../components/courses/CardCourse.jsx";
import HeaderAllCourses from "../components/courses/HeaderAllCourses.jsx";

const CoursesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50/10 min-h-screen">
      {/* Page Header */}
      <HeaderAllCourses />
      {/* Courses Section */}
      <SingleCourse />
      {/* Bottom Wave */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full"
      >
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,224L30,197.3C60,171,120,117,180,128C240,139,300,213,360,250.7C420,288,480,288,540,250.7C600,213,660,139,720,128C780,117,840,171,900,192C960,213,1020,203,1080,181.3C1140,160,1200,128,1260,128C1320,128,1380,160,1410,176L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default CoursesPage;
