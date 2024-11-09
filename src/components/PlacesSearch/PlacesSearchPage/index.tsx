import React, { useState } from "react";
import SearchForm from "../SearchForm";
import { Place } from "../../../services/placesService";
import "./style.css";
import PlacesList from "../PlacesList";
import Header from "../../Header";

const PlacesSearchPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  return (
    <>
      <Header />
      <section className="section places-search-page">
        <h1>Search around me</h1>
        <div className="search-form-container">
          <SearchForm onResults={setPlaces} />
        </div>

        <PlacesList places={places} />
      </section>
    </>
  );
};

export default PlacesSearchPage;
