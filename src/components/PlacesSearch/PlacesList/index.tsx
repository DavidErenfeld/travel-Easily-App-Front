import React from "react";
import "./style.css";
import { Place } from "../../../services/placesService";
import PlaceCard from "../PlaceCard";

interface PlacesListProps {
  places: Place[];
}

const PlacesList: React.FC<PlacesListProps> = ({ places }) => (
  <ul className="places-list">
    {places.map((place) => (
      <PlaceCard place={place} />
    ))}
  </ul>
);

export default PlacesList;
