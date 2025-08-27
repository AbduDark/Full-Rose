import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderCourse from "../components/courses/HeaderCourse";
import OverviewCourse from "../components/courses/OverviewCourse";
import InstructorCourse from "../components/courses/InstructorCourse";
import ReviewCourse from "../components/courses/ReviewCorse";
import EnrollCourse from "../components/courses/EnrollCourse";
import { useParams } from "react-router-dom";
import { getCourseById } from "../api/courses";
import Loader from "../components/common/Loader";

const CourseDetailPage = () => {
  const { t } = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();

  useEffect(() => {
    getCourseById(courseId)
      .then((res) => setCourse(res.data))
      .finally(() => setLoading(false));
  }, [courseId]);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Loader />;
  }

  if (!course) {
    return (
      <div className="py-8 text-center text-white bg-gradient-to-r from-secondary to-primary">
        {t("courseDetailPage.courseNotFound")}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen ">
      <HeaderCourse />
      {/* PAGE CONTENT */}
      <div className="py-12 -mt-12 md:-mt-16 lg:-mt-24 xl:-mt-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* TABS */}
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    <button
                      onClick={() => handleTabChange(0)}
                      className={`px-6 py-4 font-medium ${
                        tabValue === 0
                          ? "text-pink-600 border-b-2 border-pink-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t("courseDetailPage.overview")}
                    </button>
                    {/* <button
                      onClick={() => handleTabChange(1)}
                      className={`px-6 py-4 font-medium ${
                        tabValue === 1
                          ? "text-pink-600 border-b-2 border-pink-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t('courseDetailPage.instructor')}
                    </button> */}
                    <button
                      onClick={() => handleTabChange(2)}
                      className={`px-6 py-4 font-medium ${
                        tabValue === 2
                          ? "text-pink-600 border-b-2 border-pink-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t("courseDetailPage.reviews")}
                    </button>
                  </div>
                </div>

                {/* TAB CONTENT */}
                <div className="p-6">
                  {/* OVERVIEW TAB */}
                  {tabValue === 0 && <OverviewCourse />}

                  {/* INSTRUCTOR TAB */}
                  {tabValue === 1 && <InstructorCourse />}

                  {/* REVIEWS TAB */}
                  {tabValue === 2 && <ReviewCourse courseId={courseId} />}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <EnrollCourse />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
