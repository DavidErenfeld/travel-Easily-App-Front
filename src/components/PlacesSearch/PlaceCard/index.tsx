import React from "react";
import { Phone, MapPin, Star, ExternalLink, Car, Map } from "lucide-react";
import { Place } from "../../../services/placesService";
import "./style.css";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => (
  <div className="place-card">
    <div className="place-header">
      <h2 className="place-name">{place.name}</h2>
    </div>

    <div className="place-details ">
      <div className="detail-item flex-space-between">
        <span>{place.address}</span>
        <MapPin className="icon-search" />
      </div>

      <div className="detail-item flex-space-between">
        <span>{place.phone || "Not available"}</span>
        <Phone className="icon-search" />
      </div>
      <div className="detail-item">
        <span>
          {place.website === "Not available" ? (
            "Not available"
          ) : (
            <a href={place.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
        </span>
        <ExternalLink className="icon-search" />
      </div>

      <div className="detail-item ">
        {place.rating ? (
          <span>
            {place.rating} / 5 ( {place.user_ratings_total} ratings )
          </span>
        ) : (
          "Not rated yet"
        )}
        <Star className="icon-search" />
      </div>
    </div>
    {/* <div className="place-navigation">
      <a
        href={`https://waze.com/ul?ll=${place.lat},${place.lon}&navigate=yes`}
        target="_blank"
        rel="noopener noreferrer"
        className="icon-search"
      >
        <Car />
      </a>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="icon-search"
      >
        <Map />
      </a>
    </div> */}
  </div>
);

export default PlaceCard;
