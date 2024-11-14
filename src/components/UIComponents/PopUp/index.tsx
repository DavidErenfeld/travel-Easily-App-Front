import "./style.css";

interface PopUpProps {
  message: string;
  handleDeleteBtn: () => void;
  handleCancelBtn: () => void;
}
const PopUp = ({ message, handleDeleteBtn, handleCancelBtn }: PopUpProps) => {
  return (
    <div className="popup-overlay">
      <div className="pop-up">
        <p>{message}</p>
        <div className="pop-up-buttons">
          <button className="btn-cta-m" onClick={() => handleDeleteBtn()}>
            delete
          </button>
          <button className="btn-m" onClick={() => handleCancelBtn()}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
