import React from "react";
import { Phone, MapPin, Star, ExternalLink, Car, Map } from "lucide-react";
import { Place } from "../../../services/placesService";
import WazeIcon from "../../UIComponents/Icons/WazeIcon";
import "./style.css";
import GoogleMapsIcon from "../../UIComponents/Icons/GoogleMapsIcon";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => (
  <div className="place-card">
    <div className="place-header">
      <h2 className="place-name">{place.name}</h2>
    </div>

    <div className="place-details ">
      <div className="detaile-item flex-space-between">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="address"
        >
          {place.address}
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin className="icon-search" />
        </a>
      </div>

      <div className="detaile-item flex-space-between">
        <a href={`tel:${place.phone}`}>
          <span>{place.phone || "Not available"}</span>
        </a>
        <a href={`tel:${place.phone}`}>
          <Phone className="icon-search" />
        </a>
      </div>
      <div className="detaile-item">
        <span>
          {place.website === "Not available" ? (
            "Website is not available"
          ) : (
            <a href={place.website} target="_blank" rel="noopener noreferrer">
              Website
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

      <div className="detaile-item ">
        {place.rating ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {place.rating} / 5 ( {place.user_ratings_total} ratings )
          </a>
        ) : (
          "Not rated yet"
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
        <span>Navigation</span>
        <div className="flex-center-gap-s">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${place.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-search"
          >
            <GoogleMapsIcon />
          </a>
          <a
            href={`https://waze.com/ul?ll=${place.name}&navigate=yes`}
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

export default PlaceCard;
