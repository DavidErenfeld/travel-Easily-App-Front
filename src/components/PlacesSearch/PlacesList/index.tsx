import { Place } from "../../../services/placesService";
import PlaceCard from "../PlaceCard";
import "./style.css";

interface PlacesListProps {
  places: Place[];
}

const PlacesList = ({ places }: PlacesListProps) => (
  <ul className="places-list">
    {places.map((place) => (
      <li key={place.id} className="places-list-item">
        <PlaceCard place={place} />
      </li>
    ))}
  </ul>
);

export default PlacesList;
