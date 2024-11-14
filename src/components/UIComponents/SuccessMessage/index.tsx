import React, { useEffect } from "react";
import "./style.css";

interface SuccessMessageProps {
  message: string;
  onAnimationEnd: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onAnimationEnd,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="success-message">
      <div className="success-icon">
        {/* ניתן להשתמש ב-SVG או באייקון מ' react-icons' */}
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
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;
