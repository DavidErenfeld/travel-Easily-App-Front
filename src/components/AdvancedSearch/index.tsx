import React, { useState, useEffect, useRef } from "react";
import i18n from "../../i18n";
import { useNavigate } from "react-router-dom";
import MenuBar from "../Menus/MenuBar";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import "./style.css";

const AdvancedSearch: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedTripType, setSelectedTripType] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCountrysList, setShowCountrysList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countries = Object.entries(t("countries", { returnObjects: true })) as [
    string,
    string
  ][];

  const filteredCountries = countries.filter(([key, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigate = useNavigate();
  const handleSubmit = () => {
    const queryParams: Record<string, string | number> = {};

    if (selectedCountry) queryParams.country = selectedCountry;
    if (selectedGroupType) queryParams.typeTraveler = selectedGroupType;
    if (selectedTripType) queryParams.typeTrip = selectedTripType;
    if (numberOfDays) queryParams.numOfDays = parseInt(numberOfDays, 10);
    queryParams.title = "tripsList.customSearch";

    const queryString = new URLSearchParams(
      queryParams as Record<string, string>
    ).toString();
    console.log(queryString);
    navigate(`/trips?${queryString}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountrysList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Header />
      <MenuBar />

      <div className="profile-container advanced-search-section">
        <div className="form-header">
          <h2 className="form-title">{t("advancedSearch.title")}</h2>
        </div>

        {/* Group Type */}
        <div className="form-group">
          <label
            dir={i18n.language === "he" ? "rtl" : "ltr"}
            htmlFor="groupType"
          >
            {t("advancedSearch.groupTypeLabel")}
          </label>
          <select
            id="groupType"
            value={selectedGroupType}
            onChange={(e) => setSelectedGroupType(e.target.value)}
            className="form-control"
          >
            <option value="">{t("advancedSearch.groupTypePlaceholder")}</option>
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
        {/* Trip Type */}
        <div className="form-group">
          <label
            dir={i18n.language === "he" ? "rtl" : "ltr"}
            htmlFor="tripType"
          >
            {t("advancedSearch.tripTypeLabel")}
          </label>
          <select
            id="tripType"
            value={selectedTripType}
            onChange={(e) => setSelectedTripType(e.target.value)}
            className="form-control"
          >
            <option value="">{t("advancedSearch.tripTypePlaceholder")}</option>
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

        {/* Number of Days */}
        <div className="form-group">
          <label dir={i18n.language === "he" ? "rtl" : "ltr"} htmlFor="days">
            {t("advancedSearch.daysLabel")}
          </label>
          <input
            type="number"
            id="days"
            value={numberOfDays}
            onChange={(e) => {
              const value = e.target.value;
              if (parseInt(value, 10) >= 0 || value === "") {
                setNumberOfDays(value);
              }
            }}
            className="form-control"
            placeholder={t("advancedSearch.daysPlaceholder")}
            min="1"
          />
        </div>

        {/* Country */}
        <div className="form-group" ref={dropdownRef}>
          <label dir={i18n.language === "he" ? "rtl" : "ltr"} htmlFor="country">
            {t("advancedSearch.countryLabel")}
          </label>
          <input
            type="text"
            id="country"
            value={searchTerm}
            placeholder={t("advancedSearch.countryPlaceholder")}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowCountrysList(true);
            }}
            className="form-control"
            autoComplete="off"
          />
          {showCountrysList && filteredCountries.length > 0 && (
            <ul
              className={`dropdown ${
                i18n.language === "he" ? "dropdown-rtl" : "dropdown-ltr"
              }`}
            >
              {filteredCountries.map(([key, name]) => (
                <li
                  key={key}
                  onClick={() => {
                    setSelectedCountry(key);
                    setSearchTerm(name);
                    setShowCountrysList(false);
                  }}
                  className={`dropdown-item ${
                    selectedCountry === key ? "selected" : ""
                  } ${
                    i18n.language === "he" ? "dropdown-rtl" : "dropdown-ltr"
                  }`}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="btn-cta-l" onClick={handleSubmit}>
          {t("advancedSearch.searchButton")}
        </button>
      </div>
    </>
  );
};

export default AdvancedSearch;
