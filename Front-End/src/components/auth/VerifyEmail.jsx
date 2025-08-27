import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../api/auth";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await verifyEmail(email, pin);
      if (res.success) {
        setMessage(t("auth.verifyEmail.successMessage"));
      } else {
        setError(res.message || t("auth.verifyEmail.error"));
      }
    } catch (err) {
      setError(err.message || t("auth.verifyEmail.verificationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="md:max-w-[430px] max-w-[400px] w-full mx-auto p-8 bg-white/30 backdrop-blur-md backdrop-blur-md rounded-lg shadow-lg">
      <header className="text-3xl font-semibold text-gray-800 text-center">
        {t("auth.verifyEmail.title")}
      </header>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="mb-5">
          <input
            type="email"
            placeholder={t("auth.verifyEmail.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="text"
            placeholder={t("auth.verifyEmail.pinPlaceholder")}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {message && (
          <div className="text-green-600 text-sm text-center mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white text-base font-medium rounded-md transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? t("auth.verifyEmail.verifying")
            : t("auth.verifyEmail.verifyButton")}
        </button>
      </form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          {t("auth.verifyEmail.alreadyVerified")}{" "}
          <button
            onClick={handleBackToLogin}
            className="text-blue-600 hover:underline"
          >
            {t("auth.verifyEmail.backToLogin")}
          </button>
        </span>
      </div>
    </div>
  );
};

export default VerifyEmail;
