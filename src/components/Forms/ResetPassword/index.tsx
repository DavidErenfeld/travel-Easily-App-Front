import z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import LoadingDots from "../../UIComponents/Loader";
import { resetPassword } from "../../../services/usersService";
import "./style.css";
import "../formeStyle.css";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "resetPassword.password.min"),
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const { t } = useTranslation();
  const [resetError, setResetError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const location = useLocation();
  const navigate = useNavigate();

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  useEffect(() => {
    if (!getTokenFromUrl()) {
      setResetError(t("resetPassword.error.missingToken"));
    }
  }, [t]);

  const onSubmit = async (data: ResetPasswordData) => {
    const token = getTokenFromUrl();
    if (!token) {
      setResetError(t("resetPassword.error.invalidToken"));
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, data.newPassword);
      setLoading(false);
      setSuccessMessage(t("resetPassword.successMessage"));

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setResetError(t("resetPassword.error.generic"));
      setLoading(false);
    }
  };

  return (
    <form
      className="form-container flex-center-column-large-gap"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="form-title">{t("resetPassword.title")}</p>

      {resetError && <div className="text-danger">{resetError}</div>}
      {successMessage && <div className="text-success">{successMessage}</div>}

      {!successMessage && (
        <div className="form-input-box">
          <input
            {...register("newPassword")}
            type="password"
            id="newPassword"
            placeholder={t("resetPassword.placeholder")}
            className="password-input"
            autoComplete="new-password"
          />
          {errors.newPassword && (
            <p className="text-danger">
              {t(errors.newPassword.message || "default.message")}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="main-loader-section">
          <LoadingDots />
        </div>
      ) : (
        <button type="submit" className="btn-cta-l">
          {t("resetPassword.submitButton")}
        </button>
      )}
    </form>
  );
}

export default ResetPassword;
