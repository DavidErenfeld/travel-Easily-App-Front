import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

interface SuccessMessageProps {
  messageKey: string;
  onAnimationEnd: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  messageKey,
  onAnimationEnd,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="success-message">
      <div className="success-icon">
        {/* SVG icon */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="#ec8305" />
          <path
            d="M18 34L28 44L46 26"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p>{t(messageKey)}</p>
    </div>
  );
};

export default SuccessMessage;
