import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Logo from "../../assets/images/Rose_Logo.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <footer
      className={`bg-gray-900 text-white ${
        i18n.language === "ar" ? "font-arabic" : "font-['Heebo']"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src={Logo}
                alt="Rose Logo"
                className={`h-8 w-auto ${
                  i18n.language === "ar" ? "ml-3" : "mr-3"
                }`}
              />{" "}
              <h3 className="text-xl font-bold">Rose</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t("footer.aboutDescription")}
            </p>
            <div
              className={`flex ${
                i18n.language === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
              }`}
            >
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.courses")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.contactInfo")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaEnvelope
                  className={`w-4 h-4 ${
                    i18n.language === "ar" ? "ml-2" : "mr-2"
                  }`}
                />
                <span>info@rose.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaPhone
                  className={`w-4 h-4 ${
                    i18n.language === "ar" ? "ml-2" : "mr-2"
                  }`}
                />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaMapMarkerAlt
                  className={`w-4 h-4 ${
                    i18n.language === "ar" ? "ml-2" : "mr-2"
                  }`}
                />
                <span>123 Learning St, Education City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div
            className={`flex flex-col md:flex-row justify-between items-center ${
              i18n.language === "ar" ? "text-right" : "text-left"
            }`}
          >
            <p className="text-gray-300 text-sm">{t("footer.copyright")}</p>
            <div
              className={`flex mt-4 md:mt-0 ${
                i18n.language === "ar"
                  ? "space-x-reverse space-x-6"
                  : "space-x-6"
              }`}
            >
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {t("footer.privacyPolicy")}
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {t("footer.termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
