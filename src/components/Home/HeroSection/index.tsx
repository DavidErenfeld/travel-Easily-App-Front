import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import { Helmet } from "react-helmet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./style.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href="/images/Earth.webp" />
      </Helmet>

      <section className="hero-section">
        <div className={`description-container`}>
          <h1 className={`${i18n.language === "he" ? "he-title" : ""} `}>
            {t("heroTitle")}
          </h1>
          <p>{t("heroDescription")}</p>
        </div>
        <div className="earth-container">
          <LazyLoadImage
            src="/images/Earth.webp"
            alt={t("heroAltImage")}
            className="earth-image"
            effect="blur"
          />
        </div>

        <button
          onClick={() => navigate("/secontHomPage")}
          className="btn-cta-exl"
        >
          {t("heroCTA")}
        </button>
      </section>
    </>
  );
};

export default HeroSection;
