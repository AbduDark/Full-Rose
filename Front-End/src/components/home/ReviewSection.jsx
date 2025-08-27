import React, { useState, useRef } from "react";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { reviews } from "../../../public/data/data";
import { useTranslation } from "react-i18next";
const ReviewSection = () => {
  const { t, i18n } = useTranslation("common");
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideRef = useRef(null);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  const nextReview = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToReview = (index) => {
    setActiveIndex(index);
  };

  // Add touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextReview();
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevReview();
    }
  };

  return (
    <section
      className={`py-16 bg-gradient-to-b from-gray-50 to-white ${
        i18n.language === "ar" ? "font-arabic" : "font-['Heebo']"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            {t("reviewSection.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("reviewSection.subtitle")}
          </p>
        </div>

        {/* Review Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Reviews */}
          <div
            className="overflow-hidden touch-pan-y"
            ref={slideRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-4 select-none"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-6">
                      <img
                        src={review.avatar}
                        className="w-16 h-16 rounded-full shadow-md border-2 border-primary/20 p-1 mr-4"
                        alt={review.name}
                      />
                      <div>
                        <h4 className="text-xl text-gray-900 font-bold">
                          {review.name}
                        </h4>
                        <h5 className="text-primary font-medium">
                          {review.role}
                        </h5>
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg mb-6 italic">
                      <FaQuoteLeft className="text-primary/20 text-3xl mb-2" />
                      {review.text}
                    </p>

                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-gray-800 font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Hide on mobile */}
          <button
            onClick={prevReview}
            className="hidden md:block absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-lg rounded-full text-primary hover:scale-110 transition-all duration-300"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextReview}
            className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-lg rounded-full text-primary hover:scale-110 transition-all duration-300"
          >
            <FaChevronRight />
          </button>

          {/* Dots navigation */}
          <div className="flex justify-center space-x-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-6 bg-black"
                    : "bg-gray-300 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
