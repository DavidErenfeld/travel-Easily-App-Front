import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tripsService, { ITrips } from "../../../services/tripsService";
import useSocket from "../../../Hooks/useSocket";
import Header from "../../Header";
import ImageCarousel from "../../UIComponents/ImageCarousel";
import LoadingDots from "../../UIComponents/Loader";
import SuccessMessage from "../../UIComponents/SuccessMessage";
import useImageUpload from "../../../Hooks/useImageUpload";
import "./style.css";
import { Image } from "lucide-react";

interface TripDay {
  dayNum: number;
  description: string;
}

const CreateTrip: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { numberOfDays, selectedGroupType, selectedTripType, selectedCountry } =
    location.state || {};

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [dayEdits, setDayEdits] = useState<TripDay[]>(
    Array.from({ length: numberOfDays }, (_, index) => ({
      dayNum: index + 1,
      description: "",
    }))
  );

  const {
    images,
    handleImageChange,
    deleteImage,
    uploadImages,
    openImageSelector,
  } = useImageUpload([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const imageRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { send } = useSocket();

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const updatedDays = dayEdits.map((day, index) =>
      index === currentDayIndex
        ? { ...day, description: event.target.value }
        : day
    );
    setDayEdits(updatedDays);

    const updatedErrors = [...errorMessages];
    updatedErrors[currentDayIndex] = "";
    setErrorMessages(updatedErrors);
  };

  const handleSubmit = async () => {
    const errors: string[] = [];
    dayEdits.forEach((day, index) => {
      if (!day.description.trim()) {
        errors[index] = t("createTrip.errors.emptyDay", {
          day: day.dayNum,
        });
      }
    });

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    setIsSubmitting(true);

    const tripData = dayEdits.map((day) => day.description);
    const tripPhotos = await uploadImages();

    const trip: ITrips = {
      userName: localStorage.getItem("userName") || undefined,
      typeTraveler: selectedGroupType,
      country: selectedCountry,
      typeTrip: selectedTripType,
      numOfDays: numberOfDays,
      tripDescription: tripData,
      numOfComments: 0,
      numOfLikes: 0,
      tripPhotos,
      comments: [],
    };

    try {
      const savedTrip = await tripsService.postTrip(trip);
      send("newTrip", savedTrip);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error(t("createTrip.errors.submitFailed"), error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      {showSuccessMessage && (
        <SuccessMessage
          messageKey="createTrip.successMessage"
          onAnimationEnd={() => {
            setShowSuccessMessage(false);
            navigate("/");
          }}
        />
      )}
      <section
        className={`create-trip-section update-trip-section flex-stretch-column-gap section ${
          isSubmitting ? "blurred-background" : ""
        }`}
      >
        <div className="update-trip-container">
          <div className="update-details">
            <p className="day-num">
              {t("createTrip.day", { day: dayEdits[currentDayIndex].dayNum })}
            </p>
          </div>
          <textarea
            className="update-trip-description"
            value={dayEdits[currentDayIndex].description}
            onChange={handleDescriptionChange}
            placeholder={t("createTrip.placeholders.dayDescription", {
              day: dayEdits[currentDayIndex].dayNum,
            })}
          />
          {errorMessages[currentDayIndex] && (
            <p className="error-message">{errorMessages[currentDayIndex]}</p>
          )}

          <div
            className="add-image-icon"
            onClick={() => imageRef.current?.click()}
          >
            <Image className="icon" />
          </div>
          <input
            type="file"
            multiple
            ref={imageRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <button
            className="scroll-button left"
            onClick={() => setCurrentDayIndex(currentDayIndex - 1)}
            disabled={currentDayIndex === 0}
          >
            ‹
          </button>
          <button
            className="scroll-button right"
            onClick={() => setCurrentDayIndex(currentDayIndex + 1)}
            disabled={currentDayIndex === dayEdits.length - 1}
          >
            ›
          </button>
        </div>

        {currentDayIndex === dayEdits.length - 1 && (
          <button className="btn-cta-l submit-trip-btn" onClick={handleSubmit}>
            {t("createTrip.submitButton")}
          </button>
        )}

        {images.length > 0 && (
          <ImageCarousel
            deleteImage={deleteImage}
            images={images}
            showDeleteButton={true}
          />
        )}
      </section>

      {isSubmitting && (
        <div className="loading-overlay">
          <LoadingDots />
        </div>
      )}
    </>
  );
};

export default CreateTrip;
