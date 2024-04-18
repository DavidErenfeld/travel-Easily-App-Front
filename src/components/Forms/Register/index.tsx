import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import "../style.css";
import "./style.css";
import CloseIcon from "../../Icons/Close";
import AddImgsIcon from "../../Icons/AddImage";

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

interface RegisterProps {
  onClickClose: () => void;
}

function Register({ onClickClose }: RegisterProps) {
  const [imgSrc, setImgSrc] = useState("/images/user.png");
  const [registerError, setRegisterError] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  const handleChange = () => {
    console.log("Change");
  };

  return (
    <form
      className="form-container flex-center-column-large-gap"
      onSubmit={handleSubmit(onSubmit)}
    >
      {registerError && <div className="text-danger">{registerError}</div>}
      <div className="form-close-icon">
        <CloseIcon onClick={onClickClose} />
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
      <button type="submit" className="btn-l">
        Submit
      </button>
    </form>
  );
}

export default Register;
