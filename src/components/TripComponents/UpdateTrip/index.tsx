import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Image } from "lucide-react";
import { deletePhotoFromCloudinary } from "../../../services/fileService";
import tripsService, { ITrips } from "../../../services/tripsService";
import ImageCarousel from "../../UIComponents/ImageCarousel";
import LoadingDots from "../../UIComponents/Loader";
import useImageUpload from "../../../Hooks/useImageUpload";
import PopUp from "../../UIComponents/PopUp";
import "./style.css";

interface TripDay {
  dayNum: number;
  description: string;
}

interface UpdateTripProps {
  trip: ITrips;
  onClickClose: () => void;
  onClickReadMode: () => void;
}

const UpdateTrip = ({ trip, onClickReadMode }: UpdateTripProps) => {
  const { t } = useTranslation();
  const initialImages =
    trip.tripPhotos?.map((url) => ({
      src: url,
      alt: t("updateTrip.imageAlt"),
      isFromServer: true,
    })) || [];

  const {
    images,
    handleImageChange,
    deleteImage,
    uploadImages,
    openImageSelector,
  } = useImageUpload(initialImages);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const navigate = useNavigate();

  const [dayEdits, setDayEdits] = useState<TripDay[]>(
    trip.tripDescription.map((description, index) => ({
      dayNum: index + 1,
      description,
    }))
  );

  const [deleteAction, setDeleteAction] = useState<"day" | "trip" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (!image.isFromServer) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, [images]);

  useEffect(() => {
    if (deleteAction) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [deleteAction]);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const updatedDays = dayEdits.map((day, index) =>
      index === currentDayIndex
        ? { ...day, description: event.target.value }
        : day
    );
    setDayEdits(updatedDays);
  };

  const goToNextDay = () => {
    if (currentDayIndex < dayEdits.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const addNewDay = () => {
    if (dayEdits[currentDayIndex].description.trim() === "") {
      alert(t("updateTrip.alertAddContent"));
      return;
    }

    const newDay = {
      dayNum: dayEdits.length + 1,
      description: "",
    };
    setDayEdits([...dayEdits, newDay]);
    setCurrentDayIndex(dayEdits.length);
  };

  const deleteCurrentDay = async () => {
    if (dayEdits.length > 1) {
      const filteredDays = dayEdits.filter(
        (_, index) => index !== currentDayIndex
      );
      const renumberedDays = filteredDays.map((day, index) => ({
        ...day,
        dayNum: index + 1,
      }));
      setDayEdits(renumberedDays);
      setCurrentDayIndex(Math.max(0, currentDayIndex - 1));

      try {
        const updatedTrip = {
          ...trip,
          tripDescription: renumberedDays.map((day) => day.description),
        };
        await tripsService.updateTrip(updatedTrip);
        console.log(t("updateTrip.successDayDelete"));
      } catch (error) {
        console.error(t("updateTrip.errorDayDelete"), error);
      }
    } else {
      alert(t("updateTrip.alertCannotDeleteLastDay"));
    }
    setDeleteAction(null);
  };

  const deleteTrip = async () => {
    setIsSubmitting(true);
    try {
      for (const image of trip.tripPhotos || []) {
        await deletePhotoFromCloudinary(image);
      }

      await tripsService.deleteTrip(trip._id!);
      console.log(t("updateTrip.successTripDelete"));
      navigate(-1);
    } catch (error) {
      console.error(t("updateTrip.errorTripDelete"), error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDayClick = () => {
    setDeleteAction("day");
  };

  const handleDeleteTripClick = () => {
    setDeleteAction("trip");
  };

  const handleCancelDelete = () => {
    setDeleteAction(null);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const tripPhotos = await uploadImages();

      const updatedTripPhotos = [
        ...images
          .filter((image) => image.isFromServer)
          .map((image) => image.src),
        ...tripPhotos,
      ];

      const updatedTrip = {
        ...trip,
        tripDescription: dayEdits.map((day) => day.description),
        tripPhotos: updatedTripPhotos,
      };
      await tripsService.updateTrip(updatedTrip);
      console.log(t("updateTrip.successTripUpdate"));
      onClickReadMode();
    } catch (error) {
      console.error(t("updateTrip.errorTripUpdate"), error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        className={`update-trip-section flex-stretch-column-gap section ${
          isSubmitting ? "blurred-background" : ""
        }`}
      >
        {images.length > 0 && (
          <ImageCarousel
            images={images}
            deleteImage={deleteImage}
            showDeleteButton={true}
          />
        )}
        <div className="update-trip-container">
          <div className="update-details">
            <p className="day-num">
              {t("updateTrip.dayLabel")} {dayEdits[currentDayIndex].dayNum}
            </p>
            <button className="btn-l" onClick={onClickReadMode}>
              {t("updateTrip.readModeButton")}
            </button>
          </div>
          <textarea
            className="update-trip-description"
            value={dayEdits[currentDayIndex].description}
            onChange={handleDescriptionChange}
          />
          <div
            className="add-image-icon-update-component"
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
            onClick={goToPreviousDay}
            disabled={currentDayIndex === 0}
          >
            ‹
          </button>
          <button
            className="scroll-button right"
            onClick={goToNextDay}
            disabled={currentDayIndex === dayEdits.length - 1}
          >
            ›
          </button>
        </div>
        <div className="update-trip-buttons day-navigation flex-center-gap-s">
          <button className="btn-m" onClick={handleDeleteDayClick}>
            {t("updateTrip.deleteDayButton")}
          </button>
          <button className="btn-m" onClick={handleDeleteTripClick}>
            {t("updateTrip.deleteTripButton")}
          </button>
          <button className="btn-m" onClick={addNewDay}>
            {t("updateTrip.addDayButton")}
          </button>
        </div>

        <button className="btn-cta-l" onClick={handleSave}>
          {t("updateTrip.saveButton")}
        </button>
      </section>

      {isSubmitting && (
        <div className="loading-overlay">
          <LoadingDots />
        </div>
      )}

      {!isSubmitting && deleteAction && (
        <div className="popup-overlay">
          <PopUp
            message={
              deleteAction === "day"
                ? t("updateTrip.confirmDeleteDay", {
                    day: dayEdits[currentDayIndex].dayNum,
                  })
                : t("updateTrip.confirmDeleteTrip")
            }
            handleCancelBtn={handleCancelDelete}
            handleDeleteBtn={
              deleteAction === "day" ? deleteCurrentDay : deleteTrip
            }
          />
        </div>
      )}
    </>
  );
};

export default UpdateTrip;
