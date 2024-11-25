import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import "./style.css";

interface ShareButtonsProps {
  url: string;
  text: string;
  className?: string;
}

const ShareButtons = ({ url, text, className = "" }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const mailSubject = encodeURIComponent("Explore this journey with me !");
  const mailBody = encodeURIComponent(`${text} Check out this trip: ${url}`);

  return (
    <div className={`share-buttons ${className}`}>
      <a
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button whatsapp"
      >
        <FaWhatsapp className="icon-s" />
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button telegram"
      >
        <FaTelegramPlane className="icon-s" />
      </a>
      <a
        href={`mailto:?subject=${mailSubject}&body=${mailBody}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button email"
      >
        <FaEnvelope className="icon-s" />
      </a>
    </div>
  );
};

export default ShareButtons;
