import TripCard from "../../TripComponents/TripCard";
import { useTranslation } from "react-i18next";
import "./style.css";

// הגדרת הממשק
interface Trip {
  typeTraveler: string;
  country: string;
  typeTrip: string;
  numOfDays: number;
  tripDescription: string[];
  numOfComments: number;
  numOfLikes: number;
  comments: [];
}

interface LocalTrips {
  tripA: Trip;
  tripB: Trip;
  tripC: Trip;
}

const FeaturesSection = () => {
  const { t } = useTranslation();

  // המרת הנתונים ל-LocalTrips עם טיפוס
  const trips = t("localTripsData", {
    returnObjects: true,
  }) as LocalTrips;

  return (
    <section className="features-section">
      <h2 className="section-title">{t("features.title")}</h2>
      <p className="section-subtitle">{t("features.subtitle")}</p>

      <div className="feature-list">
        <div className="feature-item-1">
          <div className="no-pointer-events">
            <TripCard trip={trips.tripA} />
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
            <TripCard trip={trips.tripB} />
          </div>
        </div>

        <div className="feature-item-5">
          <div className="no-pointer-events">
            <TripCard trip={trips.tripC} />
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
