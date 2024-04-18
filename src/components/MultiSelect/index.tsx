import "./style.css";
import DropList from "../Icons/DropList";

interface MultiSelectProps {
  options: string[];
  title: string;
  toggleOption: (option: string) => void;
  selectedOptions: string[];
  isOpen: boolean;
  onTitleClick: () => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  title,
  options,
  toggleOption,
  selectedOptions,
  isOpen,
  onTitleClick,
}) => {
  const titleClass = !isOpen ? "complet-border" : "";

  return (
    <section className="multi-select-container flex-center-column">
      <h3 onClick={onTitleClick} className={`options-title ${titleClass}`}>
        {title}
      </h3>
      <div className="icon-box" onClick={onTitleClick}>
        <DropList />
      </div>

      <div className={`options ${isOpen ? "open" : ""} flex-center-column `}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`option ${
              selectedOptions.includes(option) ? "selected" : ""
            }`}
            onClick={() => toggleOption(option)}
          >
            {option}
            {/* <span className="icon"> </span> */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MultiSelect;
