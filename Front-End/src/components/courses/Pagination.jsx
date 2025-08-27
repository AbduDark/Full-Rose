import React from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ page, setPage, pageCount }) {
  const { t } = useTranslation();

  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          aria-label={t("pagination.previous")}
        >
          <FaChevronLeft />
        </button>

        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border-t border-b border-gray-300 ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            aria-label={`${t("pagination.page")} ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
          className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          aria-label={t("pagination.next")}
        >
          <FaChevronRight />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
