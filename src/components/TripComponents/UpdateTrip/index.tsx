import { useState } from "react";
import tripsService, { ITrips } from "../../../services/tripsService";
import { useNavigate } from "react-router-dom";
import PopUp from "../../CommentsComponent/PopUp";
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
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const navigate = useNavigate();

  // Assume tripDescription is an array of strings
  const [dayEdits, setDayEdits] = useState<TripDay[]>(
    trip.tripDescription.map((description, index) => ({
      dayNum: index + 1,
      description,
    }))
  );

  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [deleteAction, setDeleteAction] = useState<"day" | "trip" | null>(null);

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
      alert("Please add content to the current day before adding a new one.");
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
        navigate(-1);
        console.log("Day deleted and trip updated successfully.");
      } catch (error) {
        console.error("Failed to update trip after deleting day:", error);
      }
    } else {
      alert("Cannot delete the last remaining day.");
    }
    setIsDeleteClicked(false);
  };

  const deleteTrip = async () => {
    try {
      await tripsService.deleteTrip(trip._id!);
      console.log("Trip deleted successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
    setIsDeleteClicked(false);
  };

  const handleDeleteDayClick = () => {
    setDeleteAction("day");
    setIsDeleteClicked(true);
  };

  const handleDeleteTripClick = () => {
    setDeleteAction("trip");
    setIsDeleteClicked(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteClicked(false);
    setDeleteAction(null);
  };

  const handleSave = async () => {
    try {
      const updatedTrip = {
        ...trip,
        tripDescription: dayEdits.map((day) => day.description),
      };
      await tripsService.updateTrip(updatedTrip);
      navigate(-1);
      console.log("Trip updated successfully.");
    } catch (error) {
      console.error("Failed to update trip:", error);
    }
  };

  return (
    <>
      {!isDeleteClicked && !deleteAction ? (
        <section className="update-trip-section flex-stretch-column-gap">
          <div className="update-trip-container">
            <div className="update-details">
              <p className="day-name">Day {dayEdits[currentDayIndex].dayNum}</p>
              <button className="btn-l" onClick={onClickReadMode}>
                Read Mode
              </button>
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
          <div className="day-navigation flex-center-gap-s">
            <button className="btn-m" onClick={handleDeleteDayClick}>
              Delete Day
            </button>
            <button className="btn-m" onClick={handleDeleteTripClick}>
              Delete Trip
            </button>
            <button className="btn-m add-day-btn" onClick={addNewDay}>
              Add Day
            </button>
          </div>
          <button className="btn-l" onClick={handleSave}>
            Save
          </button>
        </section>
      ) : (
        <PopUp
          message={
            deleteAction === "day"
              ? `Are you sure you want to delete day number ${dayEdits[currentDayIndex].dayNum} ?`
              : "Are you sure you want to delete the entire trip?"
          }
          handleCancelBtn={handleCancelDelete}
          handleDeleteBtn={
            deleteAction === "day" ? deleteCurrentDay : deleteTrip
          }
        />
      )}
    </>
  );
};

export default UpdateTrip;
