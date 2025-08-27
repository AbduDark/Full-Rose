import React from "react";
import {
  FaKey,
  FaFileAlt,
  FaMedal,
  FaBriefcase,
  FaCrown,
  FaHeadphonesAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const FeaturesSection = () => {
  const { t, i18n } = useTranslation("common");
  const features = [
    {
      id: 1,
      icon: <FaKey className="text-4xl" />,
      title: t("features.instantAccess.title"),
      description: t("features.instantAccess.description"),
      offset: "",
    },
    {
      id: 2,
      icon: <FaFileAlt className="text-4xl" />,
      title: t("features.videoLessons.title"),
      description: t("features.videoLessons.description"),
      offset: "md:mt-24",
    },
    {
      id: 3,
      icon: <FaMedal className="text-4xl" />,
      title: t("features.interactiveQuizzes.title"),
      description: t("features.interactiveQuizzes.description"),
      offset: "md:mt-48",
    },
  ];

  return (
    <section
      className={`py-20 bg-gray-50 ${
        i18n.language === "ar" ? "font-arabic" : "font-['Heebo']"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto mb-16 ${
            i18n.language === "ar" ? "text-right" : "text-left"
          }`}
        >
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {t("features.title")}
          </h2>
          <p className="text-lg text-gray-600">{t("features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${feature.offset} transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="bg-white p-8 rounded-lg shadow-md h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
                {/* Gradient background overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
