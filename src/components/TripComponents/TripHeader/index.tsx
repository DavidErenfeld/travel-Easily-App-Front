import { ITrips } from "../../../services/tripsService";
import { useTranslation } from "react-i18next";
import "./style.css";
import i18n from "../../../i18n";

interface TripHeaderProps {
  trip: ITrips;
}

const TripHeader = ({ trip }: TripHeaderProps) => {
  const { t } = useTranslation();

  const formatKey = (key: string) =>
    key
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

  const formattedTypeTravelerKey = formatKey(trip.typeTraveler);

  const translatedCountry =
    t(`countries.${trip.country}`, { defaultValue: trip.country }) ||
    trip.country;

  return (
    <>
      <div className={i18n.language === "he" ? "tags-left" : "tags-right"}>
        <span className="tag">
          {t(`tripHeader.typeTraveler.${formattedTypeTravelerKey}`, {
            defaultValue: trip.typeTraveler,
          })}
        </span>
        <span className="tag">
          {t(`tripHeader.typeTrip.${trip.typeTrip}`, {
            defaultValue: trip.typeTrip,
          })}
        </span>
        <span className="tag">{translatedCountry}</span>
        <span className="tag">
          {t("tripHeader.days", { count: trip.tripDescription.length })}
        </span>
      </div>
    </>
  );
};

export default TripHeader;
