import React, { useState } from "react";
import DropList from "../Icons/DropList";
import "./style.css";

interface RadioListProps {
  title: string;
  optionsList: string[];
  isOpen: boolean;
  onTitleClick: () => void;
  onOptionSelected: (selected: string) => void; // פונקציה חדשה לעדכון האופציה שנבחרה
}

const RadioList = ({
  title,
  optionsList,
  isOpen,
  onTitleClick,
  onOptionSelected,
}: RadioListProps) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    onOptionSelected(option); // עדכון האופציה הנוכחית
    onTitleClick(); // סגירת הרשימה לאחר בחירה
  };

  const titleClass = !isOpen ? "complet-border" : "";
  return (
    <>
      <section className="flex-center-column-gap">
        <h3 onClick={onTitleClick} className={`options-title ${titleClass}`}>
          {selectedOption ? `${selectedOption}` : `${title}`}
        </h3>
        <div className="icon-box" onClick={onTitleClick}>
          <DropList />
        </div>

        <div className={`flex-center-column ${isOpen ? "open" : "details"}`}>
          {optionsList.map((option, index) => (
            <label className="option-box flex-space-between" key={index}>
              <p className="radio-option">{option}</p>
              <input
                className="radio-button"
                type="radio"
                name={title}
                value={option}
                checked={option === selectedOption}
                onChange={() => handleOptionChange(option)}
              />
            </label>
          ))}
        </div>
      </section>
    </>
  );
};

export default RadioList;
