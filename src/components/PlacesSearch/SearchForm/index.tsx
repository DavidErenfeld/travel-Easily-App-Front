import React, { useState } from "react";
import {
  fetchPlaces,
  Place,
  SearchParams,
} from "../../../services/placesService";
import "./style.css";

interface SearchFormProps {
  onResults: (places: Place[]) => void;
  setLoading: (loading: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onResults, setLoading }) => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState<number | "">("");
  const [type, setType] = useState("restaurant");
  const [errors, setErrors] = useState({ location: "", radius: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      location: location ? "" : "Please share your location",
      radius: radius ? "" : "Please enter a radius (1-10)",
    };
    setErrors(newErrors);

    if (!location || !radius) return;

    setLoading(true);
    try {
      const searchParams: SearchParams = {
        location,
        radius: Number(radius),
        type,
      };
      const places = await fetchPlaces(searchParams);
      onResults(places);
    } catch (error) {
      console.error("Failed to fetch places:", error);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
          setErrors({ ...errors, location: "" });
        },
        (error) => {
          console.error("Failed to get location:", error);
          setErrors({ ...errors, location: "Failed to get location" });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setErrors({
        ...errors,
        location: "Geolocation is not supported by this browser",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form-section">
      <div className="location-container flex-space-between">
        <button
          type="button"
          className="btn-cta-l"
          onClick={handleShareLocation}
        >
          Share My Location
        </button>
        {location && <p className="location-display">{location}</p>}
        {errors.location && (
          <p className="text-danger error-message">{errors.location}</p>
        )}
      </div>

      <div className="form-group">
        <label>
          Radius (in km):
          <input
            type="tel"
            value={radius}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 10) {
                setRadius(value);
                setErrors({ ...errors, radius: "" });
              } else {
                setRadius("");
              }
            }}
            placeholder="Enter radius (1-10)"
          />
        </label>
        {errors.radius && (
          <p className="text-danger error-message">{errors.radius}</p>
        )}
      </div>

      <div className="form-group">
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
            <option value="attraction">Attraction</option>
          </select>
        </label>
      </div>

      <button type="submit" className="submit-search-btn btn-cta-l">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
