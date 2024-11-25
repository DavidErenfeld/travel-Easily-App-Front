import z from "zod";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "../../../services/usersService";
import CloseIcon from "../../UIComponents/Icons/Close";
import LoadingDots from "../../UIComponents/Loader";
import Header from "../../Header";
import "../formeStyle.css";
import "./style.css";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword() {
  const { t } = useTranslation();
  const [resetError, setResetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const profileImage = "/images/user.png";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      setLoading(true);
      await requestPasswordReset(data.email);
      setLoading(false);
      setSuccessMessage(t("forgotPassword.successMessage"));
    } catch (error) {
      console.error("Password reset error:", error);
      setResetError(t("forgotPassword.errorMessage"));
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <form
        className="form-container flex-center-column-large-gap"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-close-icon">
          <CloseIcon color="#fff" />
        </div>
        <p className="form-title">{t("forgotPassword.title")}</p>

        <div className="form-image-profile">
          <img
            src={profileImage}
            alt={t("forgotPassword.profileAlt")}
            className="register-img"
          />
        </div>

        {resetError && <div className="text-danger">{resetError}</div>}
        {successMessage && <div className="text-success">{successMessage}</div>}

        <div className="form-input-box">
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
            className="email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-danger">{t("forgotPassword.invalidEmail")}</p>
          )}
        </div>

        {loading ? (
          <div className="main-loader-section">
            <LoadingDots />
          </div>
        ) : (
          <div className="buttons-box flex-center-column-gap">
            <button type="submit" className="btn-cta-l">
              {t("forgotPassword.sendButton")}
            </button>
            <p>{t("forgotPassword.orText")}</p>
            <Link to="/register">
              <button className="btn-l">
                {t("forgotPassword.signUpButton")}
              </button>
            </Link>
          </div>
        )}
      </form>
    </>
  );
}

export default ForgotPassword;
