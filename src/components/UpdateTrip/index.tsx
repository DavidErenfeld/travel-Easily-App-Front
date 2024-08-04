import { useState } from "react";
import "./style.css";
import PopUp from "../Comments/PopUp";

interface Trip {
  dayNum: number;
  description: string;
}

interface UpdateTripProps {
  trips: Trip[];
  onClickClose: () => void;
  onClickReadMode: () => void;
}

const UpdateTrip = ({ trips, onClickReadMode }: UpdateTripProps) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [dayEdits, setDayEdits] = useState<Trip[]>(trips);
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

  const deleteCurrentDay = () => {
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
      setIsDeleteClicked(false);
      setDeleteAction(null);
    } else {
      alert("Cannot delete the last remaining day.");
    }
    setIsDeleteClicked(false);
  };

  const deleteTrip = () => {
    // Logic to delete the entire trip
    console.log("Trip deleted");
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
          <button className="btn-l">Save</button>
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
