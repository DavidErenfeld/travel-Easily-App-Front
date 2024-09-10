import { useEffect, useRef, useState } from "react";
import { updateUser } from "../../../services/usersService";
import { uploadPhoto } from "../../../services/fileService";
import CloseIcon from "../../UIComponents/Icons/Close";
import LoadingDots from "../../UIComponents/Loader";
import "./style.css";

function PersonalArea() {
  const imgRef = useRef<HTMLInputElement>(null);
  const userName = localStorage.getItem("userName") || "";
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState(localStorage.getItem("imgUrl"));
  const [isButtonClicede, setButtonClicede] = useState(false);
  const loggedUserId = localStorage.getItem("loggedUserId");
  const [loading, setLoading] = useState(false);

  let imgUrl = localStorage.getItem("imgUrl") || "";

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setButtonClicede(true);
      setImgFile(e.target.files[0]);
      setImgSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onClickSave = async () => {
    if (imgFile) {
      imgUrl = (await handleUploadImage(imgFile)) || "";
    }
    try {
      const response = await updateUser(loggedUserId || "", { imgUrl: imgUrl });
      console.log(response);
      setButtonClicede(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadImage = async (imgFile: File) => {
    try {
      setLoading(true);
      setButtonClicede(false);
      const uploadedUrl = await uploadPhoto(imgFile);
      console.log(`Image uploaded successfully: ${uploadedUrl}`);
      return uploadedUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [imgSrc]);

  return (
    <>
      <section className="personal-area-section form-container flex-center-column-large-gap">
        <input
          type="file"
          name="img"
          ref={imgRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />
        <div className="form-close-icon">
          <CloseIcon color="#fff" />
        </div>
        <p className="form-title">Personal Area</p>

        {imgSrc && (
          <img className="register-img " src={imgSrc} alt="img profile" />
        )}
        <h1 className="profile-name">{userName}</h1>
        {loading ? (
          <div className="loader-section">
            <LoadingDots />
          </div>
        ) : (
          <div className="btn-container-gap-m ">
            <button onClick={() => imgRef.current?.click()} className="btn-m">
              Edit
            </button>

            {isButtonClicede && (
              <button onClick={onClickSave} className="btn-m">
                Save
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
export default PersonalArea;
