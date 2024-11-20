import TripCard from "../../TripComponents/TripCard";
import trips from "../../../LocalData";
import { useTranslation } from "react-i18next";
import "./style.css";

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="features-section">
      <h2 className="section-title">{t("features.title")}</h2>
      <p className="section-subtitle">{t("features.subtitle")}</p>

      <div className="feature-list">
        <div className="feature-item-1">
          <div className="no-pointer-events">
            <TripCard trip={trips[0]} />
          </div>
        </div>
        <div className="feature-item-2">
          <h3>{t("features.item1.title")}</h3>
          <p className="feature-description">
            {t("features.item1.description")}
          </p>
        </div>

        <div className="feature-item-3">
          <h3>{t("features.item2.title")}</h3>
          <p className="feature-description">
            {t("features.item2.description")}
          </p>
        </div>
        <div className="feature-item-4">
          <div className="no-pointer-events">
            <TripCard trip={trips[1]} />
          </div>
        </div>

        <div className="feature-item-5">
          <div className="no-pointer-events">
            <TripCard trip={trips[2]} />
          </div>
        </div>
        <div className="feature-item-6">
          <h3>{t("features.item3.title")}</h3>
          <p className="feature-description">
            {t("features.item3.description")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
