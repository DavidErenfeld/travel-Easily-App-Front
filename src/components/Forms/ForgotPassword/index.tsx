import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import CloseIcon from "../../UIComponents/Icons/Close";
import LoadingDots from "../../UIComponents/Loader";
import "../formeStyle.css";
import "./style.css";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../../services/usersService";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword() {
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
    console.log("Submitting forgot password form with data:", data);
    try {
      setLoading(true);
      await requestPasswordReset(data.email);
      setLoading(false);
      setSuccessMessage("A password reset link has been sent to your email.");
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
      <div className="form-close-icon">
        <CloseIcon color="#fff" />
      </div>
      <p className="form-title">Forgot Password</p>

      <div className="form-image-profile">
        <img src={profileImage} alt="Profile image" className="register-img" />
      </div>

      {resetError && <div className="text-danger">{resetError}</div>}
      {successMessage && <div className="text-success">{successMessage}</div>}

      <div className="form-input-box">
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="UserName@gmail.com"
          className="email"
          autoComplete="email"
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>

      {loading ? (
        <div className="main-loader-section">
          <LoadingDots />
        </div>
      ) : (
        <div className="buttons-box flex-center-column-gap">
          <button type="submit" className="btn-l">
            Send Reset Link
          </button>
          <p>or</p>
          <Link to="/register">
            <button className="btn-cta-l">Sign up</button>
          </Link>
        </div>
      )}
    </form>
  );
}

export default ForgotPassword;
