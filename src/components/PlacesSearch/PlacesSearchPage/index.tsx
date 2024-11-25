import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchForm from "../SearchForm";
import { Place } from "../../../services/placesService";
import PlacesList from "../PlacesList";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";

const PlacesSearchPage = () => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleResults = (results: Place[]) => {
    setPlaces(results);
    setLoading(false);
    setNoResults(results.length === 0);
  };

  return (
    <>
      <Header />
      <MenuBar />
      <section className="section places-search-page">
        <h1>{t("placesSearchPage.title")}</h1>

        <SearchForm onResults={handleResults} setLoading={setLoading} />

        {loading ? (
          <LoadingDots />
        ) : noResults ? (
          <p>{t("placesSearchPage.noResults")}</p>
        ) : (
          <PlacesList places={places} />
        )}
      </section>
    </>
  );
};

export default PlacesSearchPage;
