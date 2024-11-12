import { FaLinkedin, FaEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";
import "./style.css";

const Footer = () => {
  const contactDetails = {
    github: "https://github.com/DavidErenfeld",
    linkedin:
      "https://www.linkedin.com/in/david-erenfeld?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "1020dudu@gmail.com",
    whatsApp: "972503781079",
    phonNumber: "+972503781079",
    rights: "2024 All rights reserved to David Erenfeld",
  };

  const { linkedin, email, whatsApp, phonNumber, rights } = contactDetails;
  return (
    <footer className="footer-section">
      <div className="footer-icons">
        <a href={`${linkedin}`} target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="footer-icon" />
        </a>
        <a href={`mailto:${email}`}>
          <FaEnvelope className="footer-icon" />
        </a>
        <a
          href={`https://wa.me/${whatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="footer-icon" />
        </a>
        <a href={`tel:${phonNumber}`}>
          <FaPhone className="footer-icon" />
        </a>
      </div>
      <p className="footer-text">© {rights}</p>
    </footer>
  );
};

export default Footer;
