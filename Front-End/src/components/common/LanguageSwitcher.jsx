import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang); 
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`px-4 py-2 rounded-full text-primary bg-violet-50 hover:bg-violet-100 font-semibold shadow-sm transition-all duration-300 ${className}`}
      aria-label="Toggle language"
    >
      {i18n.language === "en" ? "العربية" : "English"}
    </button>
  );
};

export default LanguageSwitcher;
