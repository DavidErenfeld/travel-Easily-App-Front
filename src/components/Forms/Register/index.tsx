import React, { useEffect, useRef, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CloseIcon from "../../UIComponents/Icons/Close";
import AddImgsIcon from "../../UIComponents/Icons/AddImage";
import { uploadPhoto } from "../../../services/fileService";
import LoadingDots from "../../UIComponents/Loader";
import { useAuth } from "../../../Context/AuthContext";
import { useTranslation } from "react-i18next";
import "./style.css";
import "../formeStyle.css";
import authService from "../../../services/authService";

const defaultImage = "/images/user.png";

const schema = z.object({
  userName: z
    .string()
    .min(2, "register.userName.min")
    .max(15, "register.userName.max"),
  email: z.string().email("register.email.invalid"),
  password: z
    .string()
    .min(4, "register.password.min")
    .regex(/[a-z]/, "register.password.regex"),
});

type FormData = z.infer<typeof schema> & {
  image: FileList;
  imgUrl?: string;
};

function Register() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState(defaultImage);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgFile(e.target.files[0]);
      setImgSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [imgSrc]);

  const handleUploadImage = async (imgFile: File) => {
    try {
      const uploadedUrl = await uploadPhoto(imgFile);
      return uploadedUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      alert(t("register.uploadError"));
      return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    let imgUrl = defaultImage;
    if (imgFile) {
      imgUrl = (await handleUploadImage(imgFile)) || defaultImage;
    }
    try {
      setLoading(true);
      await authService.registerUser({
        userName: data.userName,
        email: data.email,
        password: data.password,
        imgUrl: imgUrl || defaultImage,
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data;
        setRegisterError(t("register.errorMessage", { message: errorMessage }));
      } else {
        setRegisterError(t("register.unexpectedError"));
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
    console.log(t("register.googleLoginFailed"));
  };

  return (
    <form
      className="form-container flex-center-column-large-gap"
      onSubmit={handleSubmit(onSubmit)}
    >
      {registerError && <div className="text-danger">{registerError}</div>}
      <div className="form-close-icon">
        <CloseIcon color="#fff" />
      </div>
      <p className="form-title">{t("register.title")}</p>

      <div className="form-image-profile">
        <div
          className="icon-select-img"
          onClick={() => imageRef.current?.click()}
        >
          <AddImgsIcon />
        </div>
        <input
          {...register("image", { required: true })}
          type="file"
          name="image"
          ref={imageRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />
        {imgSrc && (
          <img
            src={imgSrc}
            alt={t("register.imageAlt")}
            className="register-img"
          />
        )}
      </div>
      <div className="form-input-box">
        <input
          {...register("userName")}
          type="text"
          id="userName"
          placeholder={t("register.userName.placeholder")}
          className="user-name"
        />
        {errors.userName && (
          <p className="text-danger">
            {t(errors.userName.message || "default.message")}
          </p>
        )}
      </div>
      <div className="form-input-box">
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder={t("register.email.placeholder")}
          className="email"
        />
        {errors.email && (
          <p className="text-danger">
            {t(errors.email.message || "default.message")}
          </p>
        )}
      </div>
      <div className="form-input-box">
        <input
          {...register("password")}
          type="password"
          id="password"
          placeholder={t("register.password.placeholder")}
          className="password"
        />
        {errors.password && (
          <p className="text-danger">
            {t(errors.password.message || "default.message")}
          </p>
        )}
      </div>

      {loading ? (
        <div className="loader-section">
          <LoadingDots />
        </div>
      ) : (
        <button type="submit" className="btn-cta-l">
          {t("register.submitButton")}
        </button>
      )}

      <GoogleLogin
        onSuccess={onGoogleLoginSuccess}
        onError={onGoogleLoginFailure}
      />
    </form>
  );
}

export default Register;
