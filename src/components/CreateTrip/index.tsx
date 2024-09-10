import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ייבוא useLocation
import "./style.css";
import tripsService, { ITrips } from "../../services/tripsService";
import Header from "../Header";
import { uploadPhoto } from "../../services/fileService";
import AddImgs from "../UIComponents/Icons/AddImage";
import ImageCarousel from "../UIComponents/ImageCarousel"; // ייבוא קומפוננטת הקרוסלה

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
    location.state || {}; // קבלת הנתונים

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [dayEdits, setDayEdits] = useState<TripDay[]>(
    Array.from({ length: numberOfDays }, (_, index) => ({
      dayNum: index + 1,
      description: "",
    }))
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null); // הודעת הצלחה
  const [errorMessages, setErrorMessages] = useState<string[]>([]); // הודעות שגיאה לכל יום
  const [tripImages, setTripImages] = useState<File[]>([]); // סטייט לתמונות שנבחרו
  const [imagePreviews, setImagePreviews] = useState<Images[]>([]); // סטייט לתצוגה מקדימה של תמונות עם src ו-alt
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); // מערך של כתובות שהועלו
  const imageRef = useRef<HTMLInputElement>(null); // ייחוס ל-input להעלאת תמונות

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

    // ניקוי הודעת השגיאה עבור היום הנוכחי
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
      const files = Array.from(e.target.files); // המרת FileList למערך של קבצים
      const newTripImages = [...tripImages, ...files]; // הוספת התמונות החדשות למערך הקיים
      setTripImages(newTripImages);

      // יצירת URLs לתצוגה מקדימה של תמונות שנבחרו
      const newPreviews = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: "Trip Image",
      }));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  // ניקוי URLs של התמונות לאחר השימוש
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
    setUploadedUrls(urls); // שמירת הכתובות של כל התמונות שהועלו
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
    // בדיקה אם יש ימים ריקים
    const errors: string[] = [];
    dayEdits.forEach((day, index) => {
      if (!day.description.trim()) {
        errors[
          index
        ] = `Day ${day.dayNum} is empty. Please fill in the description.`;
      }
    });

    // אם יש שגיאות, הצגת הודעות שגיאה
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    // סינון הימים שאינם ריקים
    const filteredTripData = dayEdits.filter(
      (day) => day.description.trim() !== ""
    );
    const tripData = filteredTripData.map((day) => day.description);

    // העלאת התמונות והכנסת ה-URLs למערך
    const tripPhotos = await handleUploadImages(tripImages);

    const trip: ITrips = {
      userName: localStorage.getItem("userName") || undefined, // שינוי null ל-undefined
      typeTraveler: selectedGroupType,
      country: selectedCountry,
      typeTrip: selectedTripType,
      numOfDays: numberOfDays,
      tripDescription: tripData,
      numOfComments: 0,
      numOfLikes: 0,
      tripPhotos, // שמירת מערך ה-URLs של התמונות
    };

    try {
      await tripsService.postTrip(trip);
      console.log("Trip Data Submitted:", tripData);
      console.log("Additional Data:", {
        selectedGroupType,
        selectedTripType,
        selectedCountry,
      });

      // הצגת הודעת הצלחה
      setSuccessMessage("Trip saved successfully!");

      // הסרת הודעת ההצלחה אחרי 5 שניות
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/"); // חזרה לדף הבית או לכל דף אחר שתבחר
      }, 3000);

      // מניעת חזרה אחורה
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

          {/* אייקון להוספת תמונות */}
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
        {/* תצוגה מקדימה של התמונות שנבחרו בקרוסלה */}
        {imagePreviews.length > 0 && <ImageCarousel images={imagePreviews} />}
      </section>
    </>
  );
};

export default CreateTrip;
