import { useEffect, useRef, useState } from "react";
import { deleteUser, updateUser } from "../../services/usersService";
import {
  uploadPhoto,
  deletePhotoFromCloudinary,
} from "../../services/fileService";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CloseIcon from "../UIComponents/Icons/Close";
import LoadingDots from "../UIComponents/Loader";
import tripsService from "../../services/tripsService";
import PopUp from "../UIComponents/PopUp";
import Header from "../Header";
import "./style.css";
function PersonalArea() {
  const { t } = useTranslation();
  const imgRef = useRef<HTMLInputElement>(null);
  const userName = localStorage.getItem("userName") || "";
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState(localStorage.getItem("imgUrl"));
  const [isButtonClicked, setButtonClicked] = useState(false);
  const loggedUserId = localStorage.getItem("loggedUserId");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
  let imgUrl = localStorage.getItem("imgUrl") || "";

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setButtonClicked(true);
      setImgFile(e.target.files[0]);
      setImgSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const confirmDeleteUser = () => {
    setShowDeletePopup(true);
  };

  const handleCancelBtn = () => {
    setShowDeletePopup(false);
  };

  const handleDeleteUser = async () => {
    const userId = localStorage.getItem("loggedUserId");

    if (!userId) {
      console.log("No user logged in");
      return;
    }

    try {
      setIsDeleting(true);

      const userTrips: any = await tripsService.getByOwnerId(userId);

      for (const trip of userTrips) {
        for (const image of trip.tripPhotos || []) {
          await deletePhotoFromCloudinary(image);
        }
      }

      await deleteUser(userId);
      console.log("User deleted and logged out successfully");
      navigate("/");
    } catch (error) {
      console.log("Error deleting user:", error);
    } finally {
      await deleteUser(userId);
      setIsDeleting(false);
      setLoading(false);
    }
  };

  const onClickSave = async () => {
    try {
      setLoading(true);
      if (imgFile) {
        imgUrl = (await handleUploadImage(imgFile)) || "";
      }

      const response = await updateUser(loggedUserId || "", { imgUrl: imgUrl });

      localStorage.setItem("imgUrl", imgUrl);
      setButtonClicked(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (imgFile: File) => {
    try {
      setLoading(true);
      setButtonClicked(false);
      const uploadedUrl = await uploadPhoto(imgFile);
      console.log(`Image uploaded successfully: ${uploadedUrl}`);
      return uploadedUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      alert(t("personalArea.uploadError"));
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

  useEffect(() => {
    if (showDeletePopup) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [showDeletePopup]);

  return (
    <>
      <Header />
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
        <p className="form-title">{t("personalArea.title")}</p>

        {imgSrc && (
          <img
            className="register-img "
            src={imgSrc}
            alt={t("personalArea.imgAlt")}
          />
        )}
        <h1 className="profile-name">{userName}</h1>

        {loading ? (
          <div className="loader-section">
            <LoadingDots />
          </div>
        ) : (
          <div className="btn-container-gap-m ">
            <button onClick={() => imgRef.current?.click()} className="btn-m">
              {t("personalArea.edit")}
            </button>

            {isButtonClicked && (
              <button onClick={onClickSave} className="btn-cta-m">
                {t("personalArea.save")}
              </button>
            )}
          </div>
        )}

        {isDeleting ? (
          <div className="loader-section">
            <LoadingDots />
          </div>
        ) : (
          <button className="btn-m delete-btn" onClick={confirmDeleteUser}>
            {t("personalArea.deleteAccount")}
          </button>
        )}
      </section>

      {showDeletePopup && !isDeleting && (
        <PopUp
          handleCancelBtn={handleCancelBtn}
          handleDeleteBtn={handleDeleteUser}
          message={t("personalArea.deleteConfirmation")}
        />
      )}
    </>
  );
}

export default PersonalArea;
