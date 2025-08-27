import React from "react";
import { useTranslation } from "react-i18next";
import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function HeaderAllCourses() {
  const { t, i18n, ready } = useTranslation();

  // Debug: Log current language and available keys
  console.log("Current language:", i18n.language);
  console.log("Translation ready:", ready);
  console.log(
    "Translation keys:",
    t("headerAllCourses.title"),
    t("headerAllCourses.subtitle")
  );

  // Try to get translations with fallbacks
  const title = t("headerAllCourses.title", { defaultValue: "Courses" });
  const subtitle = t("headerAllCourses.subtitle", {
    defaultValue:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates dolor quibusdam sit sequi illo.",
  });

  console.log("Resolved title:", title);
  console.log("Resolved subtitle:", subtitle);

  return (
    <section
      id="intro-section"
      className=" w-full pt-16 bg-gradient-to-r from-secondary to-primary"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row j justify-between items-center text-white">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 font-['Heebo']">
            <h1 className="text-4xl mb-5 md:text-5xl text-white font-bold">
              {title}
            </h1>
            <p className="text-xl sm:text-2xl font-medium mb-6 text-gray-100">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Wave SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full"
      >
        <path
          fill="#FFFFFF"
          fillOpacity="1"
          d="M0,256L48,240C96,224,192,192,288,154.7C384,117,480,75,576,96C672,117,768,203,864,197.3C960,192,1056,96,1152,69.3C1248,43,1344,85,1392,106.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes pulse-border {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        .animate-pulse-border {
          animation: pulse-border 1.5s linear infinite;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}

export default HeaderAllCourses;
