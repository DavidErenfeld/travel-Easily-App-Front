import z from "zod";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import CloseIcon from "../../UIComponents/Icons/Close";
import LoadingDots from "../../UIComponents/Loader";
import { useAuth } from "../../../Context/AuthContext";
import authService from "../../../services/authService";
import "../formeStyle.css";
import "./style.css";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState("/images/user.png");
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await authService.loginUser({
        email: data.email,
        password: data.password,
      });
      login(response);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data;
        setLoginError(t("login.errorMessage", { message: errorMessage }));
      } else {
        setLoginError(t("login.unexpectedError"));
      }
      setLoading(false);
    }
  };

  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await authService.googleSignin(credentialResponse);
      login(response);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const onGoogleLoginFailure = () => {
    console.log(t("login.googleLoginFailed"));
  };

  return (
    <form
      className="form-container flex-center-column-large-gap"
      onSubmit={handleSubmit(onSubmit)}
    >
      {loginError && <div className="text-danger">{loginError}</div>}
      <div className="form-close-icon">
        <CloseIcon color="#fff" />
      </div>
      <p className="form-title">{t("login.title")}</p>

      <div className="form-image-profile">
        {imgSrc && (
          <img
            src={imgSrc}
            alt={t("login.profileAlt")}
            className="register-img"
          />
        )}
      </div>

      <div className="form-input-box">
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder={t("login.emailPlaceholder")}
          className="email"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-danger">{t("login.invalidEmail")}</p>
        )}
      </div>
      <div className="form-input-box">
        <input
          {...register("password")}
          type="password"
          id="password"
          placeholder={t("login.passwordPlaceholder")}
          className="password"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-danger">{t("login.invalidPassword")}</p>
        )}
      </div>
      {loading ? (
        <div className="main-loader-section">
          <LoadingDots />
        </div>
      ) : (
        <div className="buttons-box flex-center-column-gap">
          <button type="submit" className="btn-login btn-l">
            {t("login.signInButton")}
          </button>
          <p>{t("login.orText")}</p>
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginFailure}
          />

          <Link to="/register">
            <button className="btn-cta-l">{t("login.signUpButton")}</button>
          </Link>
        </div>
      )}
      <Link to={`/forgotPassword`}>
        <p className="forgot-password">{t("login.forgotPassword")}</p>
      </Link>
    </form>
  );
}

export default Login;
