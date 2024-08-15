import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router-dom";
import CloseIcon from "../../UIComponents/Icons/Close";
import AddImgsIcon from "../../UIComponents/Icons/AddImage";
import { uploadPhoto } from "../../../services/fileService";
import { registerUser } from "../../../services/registerService";
import axios from "axios";
import LoadingDots from "../../UIComponents/Loader";
import "./style.css";
import "../formeStyle.css";

const defaultImage = "/images/user.png";

const schema = z.object({
  userName: z
    .string()
    .min(2, "Name must be longer than 2 characters")
    .max(20, "Name must be less than 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .regex(/[a-z]/, "Password must include a lowercase letter"),
});

type FormData = z.infer<typeof schema> & {
  image: FileList;
  imgUrl?: string;
};

function Register() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState(defaultImage);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); // שימוש ב-useNavigate
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
      console.log(`Image uploaded successfully: ${uploadedUrl}`);
      return uploadedUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
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
      await registerUser({
        userName: data.userName,
        email: data.email,
        password: data.password,
        imgUrl: imgUrl,
      });
      setLoading(false);
      navigate("/login"); // ניתוב לדף ה-Login לאחר הרשמה מוצלחת
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data;
        setLoading(false);
        setRegisterError(errorMessage + " Please try again");
      } else {
        setLoading(false);
        setRegisterError("An unexpected error occurred. Please try again.");
      }
    }
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
      <p className="form-title">Register</p>

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
        {imgSrc && <img src={imgSrc} alt="Preview" className="register-img" />}
      </div>
      <div className="form-input-box">
        <input
          {...register("userName")}
          type="text"
          id="userName"
          placeholder="User Name"
          className="user-name"
        />
        {errors.userName && (
          <p className="text-danger">{errors.userName.message}</p>
        )}
      </div>
      <div className="form-input-box">
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="UserName@gmail.com"
          className="email"
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
      </div>
      <div className="form-input-box">
        <input
          {...register("password")}
          type="password"
          id="password"
          placeholder="Password"
          className="password"
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>

      {loading ? (
        <div className="loader-section">
          <LoadingDots />
        </div>
      ) : (
        <button type="submit" className="btn-l">
          Submit
        </button>
      )}
    </form>
  );
}

export default Register;
