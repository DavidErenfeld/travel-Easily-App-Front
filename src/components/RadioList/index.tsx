import DropList from "../Icons/DropList";
import "./style.css";

interface RadioListProps {
  title: string;
  optionsList: string[];
  isOpen: boolean;
  onTitleClick: () => void;
}

const RadioList = ({
  title,
  optionsList,
  isOpen,
  onTitleClick,
}: RadioListProps) => {
  const titleClass = !isOpen ? "complet-border" : "";
  return (
    <>
      <section className="flex-center-column-gap">
        <h3 onClick={onTitleClick} className={`options-title ${titleClass}`}>
          {title}
        </h3>
        <div className="icon-box" onClick={onTitleClick}>
          <DropList />
        </div>
        <div className={`details flex-center-column ${isOpen ? "open" : ""}`}>
          {optionsList.map((option, index) => (
            <label className="option-box flex-space-between">
              <p className="radio-option" key={index}>
                {option}
              </p>
              <input
                className="radio-button"
                type="radio"
                name={title}
                value={option}
              ></input>
            </label>
          ))}
        </div>
      </section>
    </>
  );
};

export default RadioList;
