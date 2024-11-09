import React, { useState } from "react";
import {
  fetchPlaces,
  Place,
  SearchParams,
} from "../../../services/placesService";
import "./style.css";

interface SearchFormProps {
  onResults: (places: Place[]) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onResults }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(0);
  const [type, setType] = useState("restaurant");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const searchParams: SearchParams = { location, radius, type };
      const places = await fetchPlaces(searchParams);
      onResults(places);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Failed to get location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="location-container flex-space-between">
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="search-my-locaition-btn btn-l"
          onClick={handleShareLocation}
        >
          Share My Location
        </button>
      </div>

      <label className="label">
        Radius (in km):
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
      </label>

      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Cafe</option>
          <option value="bar">Bar</option>
          <option value="attraction">Attraction</option>
        </select>
      </label>
      <button type="submit" className="submit-search-btn btn-l">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
