import React, { useState } from "react";
import SearchForm from "../SearchForm";
import { Place } from "../../../services/placesService";
import PlacesList from "../PlacesList";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";
import "./style.css";

const PlacesSearchPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [noResults, setNoResults] = useState(false); // מצב לחוסר תוצאות

  const handleResults = (results: Place[]) => {
    setPlaces(results);
    setLoading(false);
    setNoResults(results.length === 0);
  };

  return (
    <>
      <Header />
      <section className="section places-search-page">
        <h1>Explore Nearby</h1>

        <SearchForm onResults={handleResults} setLoading={setLoading} />

        {loading ? (
          <LoadingDots />
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
