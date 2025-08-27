import React from "react";
import { useTranslation } from "react-i18next";

function SubscriptionsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("subscriptionsPage.title")}
            </h1>
          </div>
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("subscriptionsPage.noSubscriptions")}
            </h3>
            <p className="text-gray-500">
              {t("subscriptionsPage.exploreCourses")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsPage;
