import { useTranslation } from "react-i18next";
import "./style.css";

interface PopUpProps {
  message: string;
  handleDeleteBtn: () => void;
  handleCancelBtn: () => void;
}

const PopUp = ({ message, handleDeleteBtn, handleCancelBtn }: PopUpProps) => {
  const { t } = useTranslation();

  return (
    <div className="popup-overlay">
      <div className="pop-up">
        <p>{message}</p>
        <div className="pop-up-buttons">
          <button className="btn-cta-m" onClick={handleDeleteBtn}>
            {t("popUp.delete")}
          </button>
          <button className="btn-m" onClick={handleCancelBtn}>
            {t("popUp.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
