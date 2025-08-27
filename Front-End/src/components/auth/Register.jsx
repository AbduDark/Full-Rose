import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../../api/auth";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t("auth.register.validation.fullNameRequired"));
      return false;
    }
    if (!formData.email.trim()) {
      setError(t("auth.register.validation.emailRequired"));
      return false;
    }
    if (!formData.email.includes("@")) {
      setError(t("auth.register.validation.validEmail"));
      return false;
    }
    if (!formData.password) {
      setError(t("auth.register.validation.passwordRequired"));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t("auth.register.validation.passwordLength"));
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setError(t("auth.register.validation.passwordsNotMatch"));
      return false;
    }
    if (!formData.gender) {
      setError(t("auth.register.validation.genderRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="absolute max-w-[400px] md:max-w-[430px] w-full p-[30px] rounded-md bg-white/30">
        <div className="w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <header className="text-[28px] font-semibold text-[#232836] mb-4">
            {t("auth.register.success.title")}
          </header>
          <p className="text-gray-600 mb-4">
            {t("auth.register.success.description")}
          </p>
          <div className="text-sm text-gray-500 mb-2">
            {t("auth.register.success.note")}
          </div>
          <div className="text-sm text-gray-500">
            <Link
              to="/auth/login"
              className="text-[#0171d3] cursor-pointer no-underline hover:underline login-link"
            >
              {t("auth.register.success.goToLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute max-w-[400px] md:max-w-[430px] w-full p-[30px] rounded-md bg-white/30">
      <div className="w-full">
        <header className="text-[28px] font-semibold text-[#232836] text-center">
          {t("auth.register.title")}
        </header>
        {error && (
          <div className="text-red-500 text-center mt-2 text-sm">{error}</div>
        )}
        <form className="mt-[30px]" onSubmit={handleSubmit}>
          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("auth.register.fullName")}
              className="h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
              required
            />
          </div>

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("auth.register.email")}
              className="h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
              required
            />
          </div>

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("auth.register.createPassword")}
              className="password h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
              required
            />
          </div>

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder={t("auth.register.confirmPassword")}
              className="password h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
              required
            />
          </div>

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("auth.register.phone")}
              className="h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
              required
            />
          </div>

          <div className="flex items-center gap-4 mt-[20px]">
            <label className="text-base font-normal text-[#232836]">
              {t("auth.register.gender")}:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="accent-[#0171d3]"
                  required
                />
                {t("auth.register.male")}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="accent-[#0171d3]"
                  required
                />
                {t("auth.register.female")}
              </label>
            </div>
          </div>

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <button
              type="submit"
              disabled={loading}
              className={`h-full w-full border-none text-base font-normal rounded-md text-white transition-all duration-300 ease-in-out cursor-pointer ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0171d3] hover:bg-[#016dcb]"
              }`}
            >
              {loading
                ? t("auth.register.creatingAccount")
                : t("auth.register.signupButton")}
            </button>
          </div>
        </form>

        <div className="text-center mt-[10px]">
          <span className="text-sm font-normal text-[#232836]">
            {t("auth.register.alreadyHaveAccount")}{" "}
            <Link
              to="/auth/login"
              className="text-[#0171d3] cursor-pointer no-underline hover:underline login-link"
            >
              {t("auth.register.login")}
            </Link>
          </span>
        </div>
      </div>

      {/* 
      <div className="relative h-[1px] w-full my-[36px] bg-[#d4d4d4]">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-[#8b8b8b] px-[15px]">
          {t("auth.login.or")}
      </div>
      </div>

      <div className="w-full">
        <a
          href="#"
          className="flex items-center justify-center text-white bg-[#4267b2] h-[50px] w-full rounded-md relative"
        >
          <img
            src={facebookImg}
            alt=""
            className="absolute top-1/2 left-[15px] transform -translate-y-1/2 h-[20px] w-[20px] object-cover"
          />
          <span>{t("auth.register.signupWithFacebook")}</span>
        </a>
      </div>

      <div className="w-full mt-4">
        <a
          href="#"
          className="flex items-center justify-center border border-solid border-[#CACACA] h-[50px] w-full rounded-md relative"
        >
          <img
            src={GoogleImg}
            alt="Google"
            className="absolute top-1/2 left-[15px] transform -translate-y-1/2 h-[20px] w-[20px] object-cover"
          />
          <span className="font-medium opacity-60 text-[#232836]">
            {t("auth.register.signupWithGoogle")}
          </span>
        </a>
      </div> 
      */}
    </div>
  );
}

export default Register;
