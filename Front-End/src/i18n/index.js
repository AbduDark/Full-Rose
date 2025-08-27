import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
// import ICU from "i18next-icu";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  // .use(ICU)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",
    lng: localStorage.getItem("i18nextLng") || "ar",
    supportedLngs: ["en", "ar"],
    ns: ["common", "translation"],
    defaultNS: "common",
    debug: import.meta.env.DEV,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["localStorage", "htmlTag", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

const applyDir = (lng) => {
  const dir = i18n.dir(lng);
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
};

i18n.on("initialized", () => applyDir(i18n.resolvedLanguage || "en"));
i18n.on("languageChanged", applyDir);

export default i18n;
