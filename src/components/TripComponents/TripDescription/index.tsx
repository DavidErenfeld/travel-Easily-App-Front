import React from "react";
import { ITrips } from "../../../services/tripsService";
import { useTranslation } from "react-i18next"; // שימוש בתרגום
import "./style.css";

interface TripDescriptionProps {
  trip: ITrips;
}

const TripDescription: React.FC<TripDescriptionProps> = ({ trip }) => {
  const { t } = useTranslation();

  return (
    <section className="trip-description-section">
      {trip?.tripDescription?.map((description, index) => (
        <div className="trip-day-details" key={index}>
          <h2 className="trip-day-title">
            {t("tripDescription.day", { day: index + 1 })}
          </h2>
          <p className="trip-day-description">{description}</p>
        </div>
      ))}
    </section>
  );
};

export default TripDescription;
