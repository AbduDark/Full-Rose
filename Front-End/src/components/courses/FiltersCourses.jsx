import React from "react";
import { useTranslation } from "react-i18next";
import { coursesData } from "../../../public/data/data";
import { useState } from "react";
import { FaFilter, FaTh, FaList } from "react-icons/fa";

function FiltersCourses() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="bg-gradient-to-r from-secondary to-primary text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("coursesPage.pageTitle")}
          </h1>
        </div>
        <p className="text-lg mt-4 max-w-2xl">
          {t("filtersCourses.description")}
        </p>

        {/* Filters */}
        <div className="mt-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                    className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  >
                    <option value="">
                      {t("filtersCourses.allCategories")}
                    </option>
                    {Array.from(
                      new Set(coursesData.map((course) => course.category))
                    ).map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="hidden md:flex justify-end items-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid" ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <FaTh className="text-white" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ml-2 ${
                    viewMode === "list" ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <FaList className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersCourses;
