import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/auth";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email);
      //  navigate("/auth/reset-password");
      setSuccess(true);
      if (res.message) {
        setMessage(res.message);
        setError("");
      } else if (res.error || res.errors) {
        const msg =
          res.error ||
          (res.errors && Object.values(res.errors).flat().join(" ")) ||
          t("auth.forgotPassword.error");
        setError(msg);
        setMessage("");
      } else {
        setMessage(t("auth.forgotPassword.successMessage"));
        setError("");
      }
    } catch {
      setError(t("auth.forgotPassword.error"));
      setMessage("");
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };
  if (success) {
    return (
      <div className="absolute max-w-[400px] md:max-w-[430px] w-full p-[30px] rounded-md bg-white/30">
        <div className="w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <header className="text-[28px] font-semibold text-[#232836] mb-4">
            {t("auth.forgotPassword.success.title")}
          </header>
          <p className="text-gray-600 mb-4">
            {t("auth.forgotPassword.success.description")}
          </p>
          <div className="text-sm text-gray-500 mb-2">
            {t("auth.forgotPassword.success.note")}
          </div>
          <div className="text-sm text-gray-500">
            <Link
              to="/auth/login"
              className="text-[#0171d3] cursor-pointer no-underline hover:underline login-link"
            >
              {t("auth.forgotPassword.success.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-[430px] max-w-[400px] w-full mx-auto p-8 bg-white/30 backdrop-blur-md rounded-lg shadow-lg">
      <header className="text-3xl font-semibold text-gray-800 text-center">
        {t("auth.forgotPassword.title")}
      </header>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="mb-5">
          <input
            type="email"
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          className="w-full p-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 transition duration-300"
        >
          {t("auth.forgotPassword.sendResetLink")}
        </button>
      </form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          {t("auth.forgotPassword.rememberPassword")}{" "}
          <button
            onClick={handleBackToLogin}
            className="text-blue-600 hover:underline"
          >
            {t("auth.forgotPassword.backToLogin")}
          </button>
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;
