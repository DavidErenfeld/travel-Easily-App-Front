import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import tripsService, { ITrips } from "../../services/tripsService";
import { uploadPhoto } from "../../services/fileService";
import Header from "../Header";
import AddImgs from "../UIComponents/Icons/AddImage";
import ImageCarousel from "../UIComponents/ImageCarousel";
import "./style.css";

interface TripDay {
  dayNum: number;
  description: string;
}

interface Images {
  src: string;
  alt: string;
}

const CreateTrip: React.FC = () => {
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

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [tripImages, setTripImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<Images[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newTripImages = [...tripImages, ...files];
      setTripImages(newTripImages);

      const newPreviews = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: "Trip Image",
      }));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.src));
    };
  }, [imagePreviews]);

  const handleUploadImages = async (imgFiles: File[]) => {
    const urls: string[] = [];
    for (const file of imgFiles) {
      const uploadedUrl = await handleUploadImage(file);
      if (uploadedUrl) {
        urls.push(uploadedUrl);
      }
    }
    setUploadedUrls(urls);
    return urls;
  };

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

  const handleSubmit = async () => {
    const errors: string[] = [];
    dayEdits.forEach((day, index) => {
      if (!day.description.trim()) {
        errors[
          index
        ] = `Day ${day.dayNum} is empty. Please fill in the description.`;
      }
    });

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    const filteredTripData = dayEdits.filter(
      (day) => day.description.trim() !== ""
    );
    const tripData = filteredTripData.map((day) => day.description);

    const tripPhotos = await handleUploadImages(tripImages);

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
    };

    try {
      await tripsService.postTrip(trip);
      console.log("Trip Data Submitted:", tripData);
      console.log("Additional Data:", {
        selectedGroupType,
        selectedTripType,
        selectedCountry,
      });

      setSuccessMessage("Trip saved successfully!");

      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/");
      }, 3000);

      window.history.replaceState(null, "", "/");
    } catch (error) {
      console.error("Failed to save the trip:", error);
    }
  };

  return (
    <>
      <Header />
      <section className="create-trip-section update-trip-section flex-stretch-column-gap">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="update-trip-container">
          <div className="update-details">
            <p className="day-name">Day {dayEdits[currentDayIndex].dayNum}</p>
          </div>
          <textarea
            className="update-trip-description"
            value={dayEdits[currentDayIndex].description}
            onChange={handleDescriptionChange}
            placeholder={`Share with us what you did on day ${dayEdits[currentDayIndex].dayNum}`}
          />
          {errorMessages[currentDayIndex] && (
            <p className="error-message">{errorMessages[currentDayIndex]}</p>
          )}

          <div
            className="add-image-icon"
            onClick={() => imageRef.current?.click()}
          >
            <AddImgs />
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
        {currentDayIndex === dayEdits.length - 1 && (
          <button className="btn-l submit-trip-btn" onClick={handleSubmit}>
            Submit
          </button>
        )}

        {imagePreviews.length > 0 && <ImageCarousel images={imagePreviews} />}
      </section>
    </>
  );
};

export default CreateTrip;
