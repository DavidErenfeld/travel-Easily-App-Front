// ResetPassword.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import LoadingDots from "../../UIComponents/Loader";
import { resetPassword } from "../../../services/usersService";
import "./style.css";
import "../formeStyle.css";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
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
  const navigate = useNavigate(); // שימוש ב-useNavigate במקום useHistory

  // הוצאת הטוקן מה-URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  useEffect(() => {
    console.log("ResetPassword component loaded");

    if (!getTokenFromUrl()) {
      setResetError("Invalid or missing token");
    }
  }, []);

  const onSubmit = async (data: ResetPasswordData) => {
    const token = getTokenFromUrl();
    if (!token) {
      setResetError("Token is missing or invalid.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, data.newPassword);
      setLoading(false);
      setSuccessMessage("Your password has been reset successfully.");

      setTimeout(() => {
        navigate("/login"); // העברת המשתמש לעמוד ההתחברות לאחר איפוס
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setResetError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      className="form-container flex-center-column-large-gap"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="form-title">Reset Password</p>

      {resetError && <div className="text-danger">{resetError}</div>}
      {successMessage && <div className="text-success">{successMessage}</div>}

      {!successMessage && (
        <div className="form-input-box">
          <input
            {...register("newPassword")}
            type="password"
            id="newPassword"
            placeholder="Enter new password"
            className="password-input"
            autoComplete="new-password"
          />
          {errors.newPassword && (
            <p className="text-danger">{errors.newPassword.message}</p>
          )}
        </div>
      )}

      {loading ? (
        <div className="main-loader-section">
          <LoadingDots />
        </div>
      ) : (
        <button type="submit" className="btn-l">
          Reset Password
        </button>
      )}
    </form>
  );
}

export default ResetPassword;
