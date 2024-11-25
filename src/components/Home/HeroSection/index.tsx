import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import i18n from "../../../i18n";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className={`description-container`}>
        <h1 className={`${i18n.language === "he" ? "he-title" : ""} `}>
          {t("heroTitle")}
        </h1>
        <p>{t("heroDescription")}</p>
      </div>
      <div className="earth-container">
        <img
          src="/images/Earth.webp"
          alt={t("heroAltImage")}
          className="earth-image"
        />
      </div>

      <button
        onClick={() => navigate("/secontHomPage")}
        className="btn-cta-exl"
      >
        {t("heroCTA")}
      </button>
    </section>
  );
};

export default HeroSection;
