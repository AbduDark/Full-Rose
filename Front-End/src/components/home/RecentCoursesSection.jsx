import React from "react";
import {
  FaGripHorizontal,
  FaList,
  FaShareAlt,
  FaStar,
  FaStarHalfAlt,
  FaClock,
  FaBook,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const RecentCoursesSection = () => {
  const { t, i18n } = useTranslation("common");

  const courses = [
    {
      id: 1,
      title: "Learn Laravel 8",
      category: "Web Back-end",
      thumbnail: "../../assets/images/course-thumbs/ct_laravel.jpg",
      rating: 4.5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed quos illo voluptate aperiam dolorem molestiae maiores repudiandae non, iusto quibusdam!",
      duration: "17h 30m",
      lessons: 74,
    },
    {
      id: 2,
      title: "Learn MySQL",
      category: "Web Back-end",
      thumbnail: "../../assets/images/course-thumbs/ct_mysql.jpg",
      rating: 4.5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed quos illo voluptate aperiam dolorem molestiae maiores repudiandae non, iusto quibusdam!",
      duration: "17h 30m",
      lessons: 74,
    },
    {
      id: 3,
      title: "PHP Programming for Web",
      category: "Web Back-end",
      thumbnail: "../../assets/images/course-thumbs/ct_php.jpg",
      rating: 4.5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed quos illo voluptate aperiam dolorem molestiae maiores repudiandae non, iusto quibusdam!",
      duration: "17h 30m",
      lessons: 74,
    },
    {
      id: 4,
      title: "Learn SASS/SCSS",
      category: "Web Front-end",
      thumbnail: "../../assets/images/course-thumbs/ct_sass.jpg",
      rating: 4.5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed quos illo voluptate aperiam dolorem molestiae maiores repudiandae non, iusto quibusdam!",
      duration: "17h 30m",
      lessons: 74,
    },
    {
      id: 5,
      title: "Learn Bootstrap 5",
      category: "Web Front-end",
      thumbnail: "../../assets/images/course-thumbs/ct_bootstrap.jpg",
      rating: 4.5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed quos illo voluptate aperiam dolorem molestiae maiores repudiandae non, iusto quibusdam!",
      duration: "17h 30m",
      lessons: 74,
    },
    {
      id: 6,
      title: "Advanced CSS",
      category: "Web Front-end",
      thumbnail: "../../assets/images/course-thumbs/ct_css.jpg",
      rating: 4.5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed quos illo voluptate aperiam dolorem molestiae maiores repudiandae non, iusto quibusdam!",
      duration: "17h 30m",
      lessons: 74,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-xs" />
      );
    }

    return stars;
  };

  return (
    <section
      id="recent-course-section"
      className={`relative bg-blue-50/10 ${
        i18n.language === "ar" ? "font-arabic" : "font-['Heebo']"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Top Wave SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full"
      >
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,224L30,197.3C60,171,120,117,180,128C240,139,300,213,360,250.7C420,288,480,288,540,250.7C600,213,660,139,720,128C780,117,840,171,900,192C960,213,1020,203,1080,181.3C1140,160,1200,128,1260,128C1320,128,1380,160,1410,176L1440,192L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
        ></path>
      </svg>

      {/* Section Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">
            {t("recentCourses.title")}
          </h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-700 hover:text-primary">
              <FaGripHorizontal />
            </button>
            <button className="p-2 text-gray-700 hover:text-primary">
              <FaList />
            </button>
          </div>
        </div>
        <p className="text-lg text-gray-500 mb-8">
          {t("recentCourses.subtitle")}
        </p>

        {/* Courses List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="card shadow-md border-0 flex flex-col lg:flex-row h-full"
            >
              <img
                src={course.thumbnail}
                className="w-full lg:w-1/3 h-48 lg:h-auto object-cover"
                alt={course.title}
              />
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <a
                    href="course-category.html"
                    className="badge text-sm px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                  >
                    {course.category}
                  </a>
                  <button
                    type="button"
                    className="text-primary text-xl hover:opacity-75 transition-opacity"
                  >
                    <FaShareAlt />
                  </button>
                </div>
                <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                  <a href="course-single.html">{course.title}</a>
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">{renderStars(course.rating)}</div>
                  <span className="text-sm text-gray-700">
                    {course.rating}/5
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="mt-auto pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center text-gray-700">
                      <FaClock className="text-red-500 mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center text-gray-700">
                      <FaBook className="text-blue-500 mr-1" />
                      {course.lessons} lessons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full"
      >
        <path
          fill="#ffffff"
          fillOpacity="1"
          d="M0,224L30,197.3C60,171,120,117,180,128C240,139,300,213,360,250.7C420,288,480,288,540,250.7C600,213,660,139,720,128C780,117,840,171,900,192C960,213,1020,203,1080,181.3C1140,160,1200,128,1260,128C1320,128,1380,160,1410,176L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};

export default RecentCoursesSection;
