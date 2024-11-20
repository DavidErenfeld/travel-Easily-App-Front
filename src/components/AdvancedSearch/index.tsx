import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import Header from "../Header";
import tripsService, { ITrips } from "../../services/tripsService";
import TripCard from "../TripComponents/TripCard";
import MenuBar from "../Menus/MenuBar";
import LoadingDots from "../UIComponents/Loader";
import { useTranslation } from "react-i18next";

const AdvancedSearch: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedTripType, setSelectedTripType] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ITrips[]>([]);
  const [isSearchSelected, setIsSearchSelected] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryNames = response.data.map(
          (country: any) => country.name.common
        );
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setIsSearchSelected(true);

      const queryParams: Record<string, string | number> = {};
      if (selectedCountry) queryParams.country = selectedCountry;
      if (selectedGroupType) queryParams.typeTraveler = selectedGroupType;
      if (selectedTripType) queryParams.typeTrip = selectedTripType;
      if (numberOfDays) queryParams.numOfDays = parseInt(numberOfDays);

      const results = await tripsService.searchTripsByParams(queryParams);
      setSearchResults(results);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setIsSearchSelected(false);
    setSelectedCountry("");
    setSelectedGroupType("");
    setSelectedTripType("");
    setNumberOfDays("");
    setSearchResults([]);
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <LoadingDots />
        </div>
      );
    }

    return (
      <>
        <button className="btn-m try-again" onClick={resetSearch}>
          {t("advancedSearch.tryAgain")}
        </button>
        {searchResults.length > 0 ? (
          <section className="trips-section">
            {searchResults.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </section>
        ) : (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("advancedSearch.noResults")}</p>
            <button className="btn-cta-l" onClick={resetSearch}>
              {t("advancedSearch.tryAgain")}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Header />
      <MenuBar />
      {isSearchSelected ? (
        <div className="search-results-container">{renderSearchResults()}</div>
      ) : (
        <div className="profile-container advanced-search-section">
          <div className="form-header">
            <h2 className="form-title">{t("advancedSearch.title")}</h2>
          </div>
          <div className="form-group">
            <label htmlFor="country">{t("advancedSearch.countryLabel")}</label>
            <input
              list="countries"
              id="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="form-control"
              placeholder={t("advancedSearch.countryPlaceholder")}
            />
            <datalist id="countries">
              {countries.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label htmlFor="groupType">
              {t("advancedSearch.groupTypeLabel")}
            </label>
            <select
              id="groupType"
              value={selectedGroupType}
              onChange={(e) => setSelectedGroupType(e.target.value)}
              className="form-control"
            >
              <option value="">
                {t("advancedSearch.groupTypePlaceholder")}
              </option>
              <option value="romantic couple">
                {t("advancedSearch.groupType.romanticCouple")}
              </option>
              <option value="happy family">
                {t("advancedSearch.groupType.happyFamily")}
              </option>
              <option value="friends">
                {t("advancedSearch.groupType.friends")}
              </option>
              <option value="seniors">
                {t("advancedSearch.groupType.seniors")}
              </option>
              <option value="single">
                {t("advancedSearch.groupType.single")}
              </option>
              <option value="groups">
                {t("advancedSearch.groupType.groups")}
              </option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tripType">
              {t("advancedSearch.tripTypeLabel")}
            </label>
            <select
              id="tripType"
              value={selectedTripType}
              onChange={(e) => setSelectedTripType(e.target.value)}
              className="form-control"
            >
              <option value="">
                {t("advancedSearch.tripTypePlaceholder")}
              </option>
              <option value="attractions">
                {t("advancedSearch.tripType.attractions")}
              </option>
              <option value="romantic">
                {t("advancedSearch.tripType.romantic")}
              </option>
              <option value="nature">
                {t("advancedSearch.tripType.nature")}
              </option>
              <option value="parties">
                {t("advancedSearch.tripType.parties")}
              </option>
              <option value="food">{t("advancedSearch.tripType.food")}</option>
              <option value="integrated">
                {t("advancedSearch.tripType.integrated")}
              </option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="days">{t("advancedSearch.daysLabel")}</label>
            <input
              type="number"
              id="days"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              className="form-control"
              placeholder={t("advancedSearch.daysPlaceholder")}
              min="1"
            />
          </div>
          <button className="btn-cta-l" onClick={handleSubmit}>
            {t("advancedSearch.searchButton")}
          </button>
        </div>
      )}
    </>
  );
};

export default AdvancedSearch;
