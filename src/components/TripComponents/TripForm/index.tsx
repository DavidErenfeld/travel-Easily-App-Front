import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../Header";
import CloseIcon from "../../UIComponents/Icons/Close";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";
import { useNavigate } from "react-router-dom";
import i18n from "../../../i18n";

const TripForm = () => {
  const { t } = useTranslation();
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedTripType, setSelectedTripType] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<string>("1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCountrysList, setShowCountrysList] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null); // יצירת רפרנס לתפריט

  const countries = Object.entries(t("countries", { returnObjects: true })) as [
    string,
    string
  ][];

  const filteredCountries = countries.filter(([key, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!selectedGroupType) {
      newErrors.selectedGroupType = t("tripForm.errors.groupType");
      valid = false;
    }
    if (!selectedTripType) {
      newErrors.selectedTripType = t("tripForm.errors.tripType");
      valid = false;
    }
    if (!numberOfDays) {
      newErrors.numberOfDays = t("tripForm.errors.days");
      valid = false;
    }
    if (!selectedCountry) {
      newErrors.selectedCountry = t("tripForm.errors.country");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigate("/create-trip", {
        state: {
          selectedGroupType,
          selectedTripType,
          numberOfDays,
          selectedCountry,
        },
      });
    }
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
      <section
        className="trip-form-section main-section"
        dir={i18n.language === "he" ? "rtl" : "ltr"}
      >
        <div className="profile-container">
          <div className="form-close-icon">
            <CloseIcon color="#fff" />
          </div>
          <div className="form-header">
            <h2 className="form-title">{t("tripForm.title")}</h2>
          </div>

          {/* Group Type */}
          <div className="form-group">
            <label
              dir={i18n.language === "he" ? "rtl" : "ltr"}
              htmlFor="groupType"
            >
              {t("tripForm.labels.groupType")}
            </label>
            <select
              id="groupType"
              value={selectedGroupType}
              onChange={(e) => {
                setSelectedGroupType(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  selectedGroupType: "",
                }));
              }}
              className="form-control"
            >
              <option value="">{t("tripForm.placeholders.groupType")}</option>
              <option value="romantic couple">
                {t("tripForm.groupTypes.romanticCouple")}
              </option>
              <option value="happy family">
                {t("tripForm.groupTypes.happyFamily")}
              </option>
              <option value="friends">
                {t("tripForm.groupTypes.friends")}
              </option>
              <option value="seniors">
                {t("tripForm.groupTypes.seniors")}
              </option>
              <option value="single">{t("tripForm.groupTypes.single")}</option>
              <option value="groups">{t("tripForm.groupTypes.groups")}</option>
            </select>
            {errors.selectedGroupType && (
              <p className="text-danger">{errors.selectedGroupType}</p>
            )}
          </div>

          {/* Trip Type */}
          <div className="form-group">
            <label
              dir={i18n.language === "he" ? "rtl" : "ltr"}
              htmlFor="tripType"
            >
              {t("tripForm.labels.tripType")}
            </label>
            <select
              id="tripType"
              value={selectedTripType}
              onChange={(e) => {
                setSelectedTripType(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  selectedTripType: "",
                }));
              }}
              className="form-control"
            >
              <option value="">{t("tripForm.placeholders.tripType")}</option>
              <option value="attractions">
                {t("tripForm.tripTypes.attractions")}
              </option>
              <option value="romantic">
                {t("tripForm.tripTypes.romantic")}
              </option>
              <option value="nature">{t("tripForm.tripTypes.nature")}</option>
              <option value="parties">{t("tripForm.tripTypes.parties")}</option>
              <option value="food">{t("tripForm.tripTypes.food")}</option>
              <option value="integrated">
                {t("tripForm.tripTypes.integrated")}
              </option>
            </select>
            {errors.selectedTripType && (
              <p className="text-danger">{errors.selectedTripType}</p>
            )}
          </div>

          {/* Number of Days */}
          <div className="form-group">
            <label dir={i18n.language === "he" ? "rtl" : "ltr"} htmlFor="days">
              {t("tripForm.labels.days")}
            </label>
            <input
              type="number"
              id="days"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              className="form-control"
              placeholder={t("tripForm.placeholders.days")}
              min="1"
            />
            {errors.numberOfDays && (
              <p className="text-danger">{errors.numberOfDays}</p>
            )}
          </div>

          {/* Country */}
          <div className="form-group" ref={dropdownRef}>
            <label
              dir={i18n.language === "he" ? "rtl" : "ltr"}
              htmlFor="country"
            >
              {t("tripForm.labels.country")}
            </label>
            <input
              type="text"
              id="country"
              value={searchTerm}
              placeholder={t("tripForm.placeholders.country")}
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
                    } `}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
            {errors.selectedCountry && (
              <p className="text-danger">{errors.selectedCountry}</p>
            )}
          </div>

          <button className="btn-cta-l" onClick={handleSubmit}>
            {t("tripForm.nextButton")}
          </button>
        </div>
      </section>
    </>
  );
};

export default TripForm;
