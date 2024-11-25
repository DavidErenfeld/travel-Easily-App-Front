import React from "react";
import { Phone, MapPin, Star, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Place } from "../../../services/placesService";
import WazeIcon from "../../UIComponents/Icons/WazeIcon";
import GoogleMapsIcon from "../../UIComponents/Icons/GoogleMapsIcon";
import "./style.css";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const { t } = useTranslation();

  return (
    <div className="place-card">
      <div className="place-header">
        <h2 className="place-name">{place.name}</h2>
        <p className="address"> {place.address}</p>
      </div>

      <div className="place-details">
        <div className="detaile-item flex-space-between">
          <a href={`tel:${place.phone}`}>
            <span>
              {place.phone?.includes("0")
                ? place.phone
                : t("placeCard.notAvailable")}
            </span>
          </a>
          <a className="icon-button" href={`tel:${place.phone}`}>
            <Phone className="icon-search" />
          </a>
        </div>

        <div className="detaile-item">
          <span>
            {place.website === "Not available" ? (
              t("placeCard.websiteNotAvailable")
            ) : (
              <a href={place.website} target="_blank" rel="noopener noreferrer">
                {t("placeCard.website")}
              </a>
            )}
          </span>
          {place.website === "Not available" ? (
            <ExternalLink className="icon-search" />
          ) : (
            <a href={place.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="icon-search" />
            </a>
          )}
        </div>

        <div className="detaile-item">
          {place.rating ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("placeCard.rating", {
                rating: place.rating,
                totalRatings: place.user_ratings_total,
              })}
            </a>
          ) : (
            t("placeCard.notRated")
          )}
          {place.rating ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="icon-search" />
            </a>
          ) : (
            <Star className="icon-search" />
          )}
        </div>

        <div className="detaile-item nav-icons">
          <div className="nav-icon">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-search"
            >
              <GoogleMapsIcon />
            </a>
          </div>
          <div className="nav-icon">
            <a
              href={`https://waze.com/ul?ll=${place.lat},${place.lon}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-search"
            >
              <WazeIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
