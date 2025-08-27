import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AboutImg from "../assets/images/Background.png";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
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
            {t("aboutPage.title")}
          </h1>
          <p className="text-gray-100 text-lg md:text-xl mt-4 max-w-4xl">
            {t("aboutPage.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 z- lg:px-8 my-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("aboutPage.historyTitle")}
            </h2>
            <p className="text-gray-600 mb-4">{t("aboutPage.historyText1")}</p>
            <p className="text-gray-600 mb-6 lg:mb-8">
              {t("aboutPage.historyText2")}
            </p>
            <Link to="/contact">
              <button className="bg-secondary text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700">
                {t("aboutPage.contactUs")}
              </button>
            </Link>
          </div>
          <div className="flex justify-center">
            <img
              src={AboutImg}
              alt="About us section"
              className="w-3/4 h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="relative pt-12 pb-16">
        <div
          className="relative z-0 pt-12 pb-64 bg-gradient-to-r from-secondary to-primary"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              {t("aboutPage.faqTitle")}
            </h2>
            <p className="text-gray-100 text-lg max-w-4xl">
              {t("aboutPage.faqSubtitle")}
            </p>
          </div>
        </div>
        <div className="relative -mt-56">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {t("aboutPage.faqs", { returnObjects: true }).map(
                  (faq, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
