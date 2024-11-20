import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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

const SearchForm = ({ onResults, setLoading }: SearchFormProps) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState<number | "">("");
  const [type, setType] = useState("restaurant"); // הערך שנשלח לשרת נשאר באנגלית
  const [errors, setErrors] = useState({ location: "", radius: "" });

  const typeOptions = [
    { value: "restaurant", label: t("searchForm.types.restaurant") },
    { value: "cafe", label: t("searchForm.types.cafe") },
    { value: "bar", label: t("searchForm.types.bar") },
    { value: "attraction", label: t("searchForm.types.attraction") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      location: location ? "" : t("searchForm.errors.location"),
      radius: radius ? "" : t("searchForm.errors.radius"),
    };
    setErrors(newErrors);

    if (!location || !radius) return;

    setLoading(true);
    try {
      const searchParams: SearchParams = {
        location,
        radius: Number(radius),
        type, // הערך שנשלח לשרת
      };
      const places = await fetchPlaces(searchParams);
      onResults(places);
    } catch (error) {
      console.error(t("searchForm.errors.fetchFailed"), error);
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
          console.error(t("searchForm.errors.locationFailed"), error);
          setErrors({
            ...errors,
            location: t("searchForm.errors.locationFailed"),
          });
        }
      );
    } else {
      console.error(t("searchForm.errors.geolocationUnsupported"));
      setErrors({
        ...errors,
        location: t("searchForm.errors.geolocationUnsupported"),
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
          {t("searchForm.shareLocation")}
        </button>
        {location && <p className="location-display">{location}</p>}
        {errors.location && (
          <p className="text-danger error-message">{errors.location}</p>
        )}
      </div>

      <div className="form-group">
        <label>
          {t("searchForm.radius")}:
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
            placeholder={t("searchForm.radiusPlaceholder")}
          />
        </label>
        {errors.radius && (
          <p className="text-danger error-message">{errors.radius}</p>
        )}
      </div>

      <div className="form-group">
        <label>
          {t("searchForm.type")}:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="submit-search-btn btn-cta-l">
        {t("searchForm.searchButton")}
      </button>
    </form>
  );
};

export default SearchForm;
