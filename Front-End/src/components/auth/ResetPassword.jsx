import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({
        email,
        pin,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/auth/login");
      if (res.message) {
        setMessage(res.message);
        setError("");
      } else if (res.error || res.errors) {
        const msg =
          res.error ||
          (res.errors && Object.values(res.errors).flat().join(" ")) ||
          t("auth.resetPassword.error");
        setError(msg);
        setMessage("");
      } else {
        setMessage(t("auth.resetPassword.successMessage"));
        setError("");
      }
    } catch {
      setError(t("auth.resetPassword.error"));
      setMessage("");
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="md:max-w-[430px] max-w-[400px] w-full mx-auto p-8 bg-white/30 backdrop-blur-md rounded-lg shadow-lg">
      <header className="text-3xl font-semibold text-gray-800 text-center">
        {t("auth.resetPassword.title")}
      </header>
      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="mb-5">
          <input
            type="email"
            placeholder={t("auth.resetPassword.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-5">
          <input
            type="text"
            placeholder={t("auth.resetPassword.pinPlaceholder")}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative h-[50px] w-full mt-[20px] rounded-md">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.resetPassword.createPassword")}
            className="password h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
            required
          />
        </div>

        <div className="relative h-[50px] w-full mt-[20px] mb-7 rounded-md">
          <input
            type="password"
            name="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder={t("auth.resetPassword.confirmPassword")}
            className="password h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
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
          {t("auth.resetPassword.resetButton")}
        </button>
      </form>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          {t("auth.resetPassword.rememberPassword")}{" "}
          <button
            onClick={handleBackToLogin}
            className="text-blue-600 hover:underline"
          >
            {t("auth.resetPassword.backToLogin")}
          </button>
        </span>
      </div>
    </div>
  );
};

export default ResetPassword;
