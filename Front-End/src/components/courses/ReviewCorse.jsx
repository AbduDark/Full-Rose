import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { RatingsCourse, getCourseRatings } from "../../api/courses";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import i18next from "i18next";

function ReviewCourse() {
  const { t } = useTranslation();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const effectiveCourseId = courseId;

  useEffect(() => {
    let isMounted = true;
    async function fetchReviews() {
      setLoading(true);
      try {
        const data = await getCourseRatings(effectiveCourseId);
        if (isMounted) setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        if (isMounted) setReviews([]);
      }
      if (isMounted) setLoading(false);
    }
    if (effectiveCourseId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [effectiveCourseId, reviewSuccess]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);

    if (!reviewRating || !reviewText) {
      setReviewError(t("reviewCourse.provideRatingAndText"));
      return;
    }

    if (!token) {
      setReviewError(t("reviewCourse.loginToReview"));
      return;
    }

    try {
      console.log("Submitting review with:", {
        courseId: effectiveCourseId,
        rating: reviewRating,
        comment: reviewText,
        hasToken: !!token,
      });

      await RatingsCourse(effectiveCourseId, reviewRating, reviewText, token);
      setReviewSuccess(true);
      setReviewText("");
      setReviewRating(0);
    } catch (err) {
      console.error("Review submission error:", err);
      const message = err?.message || t("reviewCourse.reviewError");
      if (message.toLowerCase().includes("unauth")) {
        setReviewError(t("reviewCourse.sessionExpired"));
        try {
          await logout();
        } catch (logoutErr) {
          console.debug("Logout failed (ignored)", logoutErr);
        }
        setTimeout(() => navigate("/auth"), 800);
        return;
      }
      setReviewError(message);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {t("reviewCourse.studentReviews")}
      </h2>
      {loading ? (
        <p>{t("reviewCourse.loadingReviews")}</p>
      ) : reviews && reviews.length > 0 ? (
        <>
          <div dir="ltr" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-5xl font-bold mb-2">{averageRating}</h3>
                <div className="flex justify-center md:justify-start mb-2">
                  {renderStars(averageRating)}
                </div>
                <p className="text-gray-500">
                  {t("reviewCourse.basedOnAverage")}
                </p>
              </div>
              <div>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(
                    (r) => r.rating === rating
                  ).length;
                  const percent =
                    reviews.length > 0
                      ? Math.round((count / reviews.length) * 100)
                      : 0;
                  return (
                    <div key={rating} className="mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-yellow-400 h-1.5 rounded-full"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {rating}
                          </span>
                          <FaStar className="text-yellow-400 text-sm" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div className="space-y-6">
            {reviews.map((comment) => (
              <div key={comment.id}>
                <div className="flex pb-6 mb-6 border-b border-gray-100">
                  {comment.user?.image ? (
                    <img
                      src={
                        comment.user?.image ||
                        "../../../public/images/Rose_Logo.png"
                      }
                      alt={comment.user?.name || "User"}
                      className="w-16 h-16 rounded-full mr-6"
                    />
                  ) : (
                    <FaUserCircle
                      className={`text-2xl ${
                        i18next.language === "ar" ? "ml-6" : "mr-6"
                      }`}
                    />
                  )}
                  <div>
                    <h3 className="font-bold">
                      {comment.user?.name || "User"}
                    </h3>
                    <div className="flex mb-2">
                      {renderStars(comment.rating)}
                    </div>
                    <p className="text-gray-600 mb-2">{comment.review}</p>
                    <p className="text-sm text-gray-400">
                      {comment.created_at?.split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>{t("reviewCourse.noReviews")}</p>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          {t("reviewCourse.leaveReview")}
        </h2>
        {reviewError && <p className="text-red-500 mb-4">{reviewError}</p>}
        {reviewSuccess && (
          <p className="text-green-500 mb-4">
            {t("reviewCourse.reviewSubmitted")}
          </p>
        )}
        <form onSubmit={handleReviewSubmit} className="mt-4">
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-gray-700 mb-2">
                {t("reviewCourse.yourRating")}
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= reviewRating ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="review-text" className="block text-gray-700 mb-2">
                {t("reviewCourse.yourReview")}
              </label>
              <textarea
                id="review-text"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg flex items-center"
                disabled={!reviewRating || !reviewText}
              >
                <FaUser
                  className={`${i18next.language === "ar" ? "ml-2" : "mr-2"}`}
                />
                {t("reviewCourse.postReview")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewCourse;
