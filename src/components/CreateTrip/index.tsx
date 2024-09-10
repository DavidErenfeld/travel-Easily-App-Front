import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ייבוא useLocation
import "./style.css";
import tripsService, { ITrips } from "../../services/tripsService";

interface TripDay {
  dayNum: number;
  description: string;
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

  const handleSubmit = async () => {
    // סינון הימים שאינם ריקים
    const filteredTripData = dayEdits.filter(
      (day) => day.description.trim() !== ""
    );
    const tripData = filteredTripData.map((day) => day.description);

    const trip: ITrips = {
      userName: localStorage.getItem("userName") || undefined, // שינוי null ל-undefined
      typeTraveler: selectedGroupType,
      country: selectedCountry,
      typeTrip: selectedTripType,
      numOfDays: numberOfDays,
      tripDescription: tripData,
      numOfComments: 0,
      numOfLikes: 0,
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
    <section className="update-trip-section flex-stretch-column-gap">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="update-trip-container">
        <h1 className="title">Describe Each Day of Your Journey</h1>
        <div className="update-details">
          <p className="day-name">Day {dayEdits[currentDayIndex].dayNum}</p>
        </div>
        <textarea
          className="update-trip-description"
          value={dayEdits[currentDayIndex].description}
          onChange={handleDescriptionChange}
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
        <button className="btn-l" onClick={handleSubmit}>
          Submit
        </button>
      )}
    </section>
  );
};

export default CreateTrip;
