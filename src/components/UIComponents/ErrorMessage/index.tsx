import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

interface ErrorMessageProps {
  messageKey: string;
  onAnimationEnd: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
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
    <>
      <div className="error-message-background"></div>
      <div className="error-message">
        <div className="error-icon">
          {/* SVG icon */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="#d32f2f" />
            <line
              x1="20"
              y1="20"
              x2="44"
              y2="44"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="44"
              y1="20"
              x2="20"
              y2="44"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p>{t(messageKey)}</p>
      </div>
    </>
  );
};

export default ErrorMessage;
