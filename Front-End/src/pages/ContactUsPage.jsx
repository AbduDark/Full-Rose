import i18next from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ContactUsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      {/* Heading */}
      <div
        className="relative z-0 pt-8 pb-48 md:pt-12 md:pb-64 bg-gradient-to-r from-secondary to-primary"
        style={{
          clipPath:
            "polygon(100% 0, 0 0, 0 77.5%, 1% 77.4%, 2% 77.1%, 3% 76.6%, 4% 75.9%, 5% 75.05%, 6% 74.05%, 7% 72.95%, 8% 71.75%, 9% 70.55%, 10% 69.3%, 11% 68.05%, 12% 66.9%, 13% 65.8%, 14% 64.8%, 15% 64%, 16% 63.35%, 17% 62.85%, 18% 62.6%, 19% 62.5%, 20% 62.65%, 21% 63%, 22% 63.5%, 23% 64.2%, 24% 65.1%, 25% 66.1%, 26% 67.2%, 27% 68.4%, 28% 69.65%, 29% 70.9%, 30% 72.15%, 31% 73.3%, 32% 74.35%, 33% 75.3%, 34% 76.1%, 35% 76.75%, 36% 77.2%, 37% 77.45%, 38% 77.5%, 39% 77.3%, 40% 76.95%, 41% 76.4%, 42% 75.65%, 43% 74.75%, 44% 73.75%, 45% 72.6%, 46% 71.4%, 47% 70.15%, 48% 68.9%, 49% 67.7%, 50% 66.55%, 51% 65.5%, 52% 64.55%, 53% 63.75%, 54% 63.15%, 55% 62.75%, 56% 62.55%, 57% 62.5%, 58% 62.7%, 59% 63.1%, 60% 63.7%, 61% 64.45%, 62% 65.4%, 63% 66.45%, 64% 67.6%, 65% 68.8%, 66% 70.05%, 67% 71.3%, 68% 72.5%, 69% 73.6%, 70% 74.65%, 71% 75.55%, 72% 76.35%, 73% 76.9%, 74% 77.3%, 75% 77.5%, 76% 77.45%, 77% 77.25%, 78% 76.8%, 79% 76.2%, 80% 75.4%, 81% 74.45%, 82% 73.4%, 83% 72.25%, 84% 71.05%, 85% 69.8%, 86% 68.55%, 87% 67.35%, 88% 66.2%, 89% 65.2%, 90% 64.3%, 91% 63.55%, 92% 63%, 93% 62.65%, 94% 62.5%, 95% 62.55%, 96% 62.8%, 97% 63.3%, 98% 63.9%, 99% 64.75%, 100% 65.7%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-white font-bold">
            {t("contactPage.title")}
          </h1>
          <p className="text-gray-100 text-lg md:text-xl mt-4 max-w-4xl">
            {t("contactPage.subtitle")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-20 md:-mt-60 mb-40">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <div className="flex justify-center flex-col md:flex-row">
              <div className="md:col-span-1">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center border-b pb-2 mb-4">
                    <svg
                      className={`w-6 h-6 text-secondary ${
                        i18next.language === "ar" ? "ml-2" : "mr-2"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t("contactPage.contactInfo")}
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span
                        className={`bg-indigo-50 text-secondary rounded-full p-2 ${
                          i18next.language === "ar" ? "ml-3" : "mr-3"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {t("contactPage.phone")}
                        </h3>
                        <a
                          href="tel:+201126576004"
                          className="text-gray-600 italic hover:underline"
                        >
                          +201126576004
                        </a>
                      </div>
                    </li>
                    <hr className="my-2" />
                    <li className="flex items-start">
                      <span
                        className={`bg-indigo-50 text-secondary rounded-full p-2 ${
                          i18next.language === "ar" ? "ml-3" : "mr-3"
                        }`}
                      >
                        {" "}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {t("contactPage.email")}
                        </h3>
                        <a
                          href="mailto:info@example.com"
                          className="text-gray-600 text-xs md:text-lg italic hover:underline"
                        >
                          mohamedgomaafathi@gmail.com
                        </a>
                      </div>
                    </li>
                    <hr className="my-2" />
                    <li className="flex items-start">
                      <span
                        className={`bg-indigo-50 text-secondary rounded-full p-2 ${
                          i18next.language === "ar" ? "ml-3" : "mr-3"
                        }`}
                      >
                        {" "}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {t("contactPage.location")}
                        </h3>
                        <a
                          href="#"
                          className="text-gray-600 italic hover:underline"
                        >
                          Beni Suf, Egypt
                        </a>
                      </div>
                    </li>
                  </ul>
                  {/* <h3 className="text-lg font-semibold text-gray-600 mt-8 mb-4">
                    {t("contactPage.followOn")}
                  </h3> */}
                  {/* <div className="flex flex-wrap gap-4">
                    <a
                      href="#"
                      className="flex items-center text-gray-600 hover:text-indigo-600"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                      {t("contactPage.socialLinks.facebook")}
                    </a>
                    <a
                      href="#"
                      className="flex items-center text-gray-600 hover:text-blue-400"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                      {t("contactPage.socialLinks.twitter")}
                    </a>
                    <a
                      href="https://www.linkedin.com/in/mohamedgomaaf/"
                      className="flex items-center text-gray-600 hover:text-indigo-600"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      {t("contactPage.socialLinks.linkedin")}
                    </a>
                    <a
                      href="https://github.com/mohamedgomaaf"
                      className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-gray-800"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.28 1.08 2.84.82.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.92 0-1.08.38-1.96 1.01-2.65-.1-.25-.44-1.26.1-2.63 0 0 .83-.27 2.72 1.01a9.37 9.37 0 012.46-.33c.84 0 1.68.11 2.46.33 1.89-1.28 2.72-1.01 2.72-1.01.54 1.37.2 2.38.1 2.63.63.69 1.01 1.57 1.01 2.65 0 3.82-2.34 4.66-4.56 4.91.36.31.68.92.68 1.85v2.74c0 .27.16.59.66.5A10 10 0 0022 12c0-5.51-4.49-10-10-10z" />
                      </svg>
                      {t("contactPage.socialLinks.github")}
                    </a>
                    <a
                      href="#"
                      className="flex items-center text-gray-600 hover:text-indigo-600"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.846 6.887c.03-.295 0-.417-.126-.56l-2.644-2.6 1.086-1.053 3.73 3.674c.24.24.24.628 0 .87l-3.73 3.674-1.085-1.054 2.644-2.6c.125-.142.155-.265.125-.56zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 17.25c-4.135 0-7.5-3.365-7.5-7.5s3.365-7.5 7.5-7.5 7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5z" />
                      </svg>
                      {t("contactPage.socialLinks.telegram")}
                    </a>
                    <a
                      href="#"
                      className="flex items-center text-gray-600 hover:text-red-600"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {t("contactPage.socialLinks.mail")}
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
