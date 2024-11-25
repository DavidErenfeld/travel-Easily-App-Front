import { FaLinkedin, FaEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./style.css";

const Footer = () => {
  const { t } = useTranslation();

  const contactDetails = {
    github: "https://github.com/DavidErenfeld",
    linkedin:
      "https://www.linkedin.com/in/david-erenfeld?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    email: "1020dudu@gmail.com",
    whatsApp: "972503781079",
    phoneNumber: "+972503781079",
  };

  const { linkedin, email, whatsApp, phoneNumber } = contactDetails;

  return (
    <footer className="footer-section">
      <div className="footer-icons">
        {/* LinkedIn */}
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
        >
          <FaLinkedin className="footer-icon" />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsApp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Send a WhatsApp Message"
        >
          <FaWhatsapp className="footer-icon" />
        </a>
        {/* Email */}
        <a href={`mailto:${email}`} aria-label="Send an Email">
          <FaEnvelope className="footer-icon" />
        </a>
        {/* Phone */}
        <a href={`tel:${phoneNumber}`} aria-label="Make a Phone Call">
          <Phone className="footer-icon-lucide" />
        </a>
      </div>

      <p className="footer-text">
        © {new Date().getFullYear()} {t("footer.rights")}
      </p>

      <p className="footer-privacy">
        <Link to="/privacy-policy" className="footer-link">
          {t("footer.privacyPolicy")}
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
