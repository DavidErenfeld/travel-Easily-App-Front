import React, { useState } from "react";
import SearchForm from "../SearchForm";
import { Place } from "../../../services/placesService";
import "./style.css";
import PlacesList from "../PlacesList";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";

const PlacesSearchPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [noResults, setNoResults] = useState(false); // מצב לחוסר תוצאות

  const handleResults = (results: Place[]) => {
    setPlaces(results);
    setLoading(false); // מסיים את הטעינה לאחר קבלת הנתונים
    setNoResults(results.length === 0); // בודק אם יש תוצאות
  };

  return (
    <>
      <Header />
      <section className="section places-search-page">
        <h1>Explore Nearby</h1>
        <div className="search-form-container">
          <SearchForm onResults={handleResults} setLoading={setLoading} />
        </div>

        {loading ? (
          <LoadingDots /> // מציג את הטעינה
        ) : noResults ? (
          <p>No places found. Please try another search.</p>
        ) : (
          <PlacesList places={places} />
        )}
      </section>
    </>
  );
};

export default PlacesSearchPage;
