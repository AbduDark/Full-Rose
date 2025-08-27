import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message?.en || t("auth.login.loginFailed"));
      }
    } catch (error) {
      setError(error.message || t("auth.login.loginFailed"));
    }
  };

  return (
    <div className="md:max-w-[430px] max-w-[400px] w-full p-[30px] rounded-md bg-white/30 backdrop-blur-md shadow-lg">
      <div className="w-full">
        <header className="text-[28px] font-semibold text-[#232836] text-center">
          {t("auth.login.title")}
        </header>
        <form className="mt-[30px]" onSubmit={handleSubmit}>
          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t("auth.login.email")}
              className="h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
            />
          </div>

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t("auth.login.password")}
              className="password h-full w-full text-base font-normal rounded-md outline-none px-[15px] border border-solid border-[#CACACA] focus:border-b-2"
            />
            <i className="bx bx-hide eye-icon absolute top-1/2 right-[10px] transform -translate-y-1/2 text-[18px] text-[#8b8b8b] cursor-pointer p-[5px]"></i>
          </div>

          <div className="text-center mt-[10px]">
            <Link
              to="/auth/forgot-password"
              className="text-[#0171d3] text-sm font-normal no-underline hover:underline"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="relative h-[50px] w-full mt-[20px] rounded-md">
            <button
              type="submit"
              className="h-full w-full border-none text-base font-normal rounded-md text-white bg-[#0171d3] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#016dcb]"
            >
              {t("auth.login.loginButton")}
            </button>
          </div>
        </form>

        <div className="text-center mt-[10px]">
          <span className="text-sm font-normal text-[#232836]">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/auth/register"
              className="text-[#0171d3] cursor-pointer no-underline hover:underline signup-link"
            >
              {t("auth.login.signup")}
            </Link>
          </span>
        </div>
      </div>

      {/* <div className="relative h-[1px] w-full my-[36px] bg-[#d4d4d4]">
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
            alt="facebookImg"
            className="absolute top-1/2 left-[15px] transform -translate-y-1/2 h-[20px] w-[20px] object-cover"
          />
          <span>{t("auth.login.loginWithFacebook")}</span>
        </a>
      </div>

      <div className="w-full mt-4">
        <a
          href="#"
          className="flex items-center justify-center border border-solid border-[#CACACA] h-[50px] w-full rounded-md relative"
        >
          <img
            src={GoogleImg}
            alt="GoogleImg"
            className="absolute top-1/2 left-[15px] transform -translate-y-1/2 h-[20px] w-[20px] object-cover"
          />
          <span className="font-medium opacity-60 text-[#232836]">
            {t("auth.login.loginWithGoogle")}
          </span>
        </a>
      </div> */}
    </div>
  );
};

export default Login;
