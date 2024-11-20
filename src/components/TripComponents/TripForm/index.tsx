import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next"; 
import Header from "../../Header";
import CloseIcon from "../../UIComponents/Icons/Close";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";

const TripForm: React.FC = () => {
  const { t } = useTranslation();
  const [selectedGroupType, setSelectedGroupType] = useState<string>("");
  const [selectedTripType, setSelectedTripType] = useState<string>("");
  const [numberOfDays, setNumberOfDays] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countries, setCountries] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryNames = response.data.map(
          (country: any) => country.name.common
        );
        setCountries(countryNames);
      } catch (error) {
        console.error(t("tripForm.errors.fetchCountries"), error);
      }
    };

    fetchCountries();
  }, [t]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCountry(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, selectedCountry: "" }));
  };

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfDays(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, numberOfDays: "" }));
  };

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

  const goToCreateTripPage = () => {
    if (validateForm()) {
      navigate("/create-trip", {
        state: {
          selectedGroupType,
          selectedTripType,
          numberOfDays: parseInt(numberOfDays, 10),
          selectedCountry,
        },
      });
    }
  };

  return (
    <>
      <Header />
      <MenuBar />
      <section className="main-section ">
        <div className="profile-container">
          <div className="form-close-icon">
            <CloseIcon color="#fff" />
          </div>
          <div className="form-header">
            <h2 className="form-title">{t("tripForm.title")}</h2>
          </div>

          <div className="form-group">
            <label htmlFor="groupType">{t("tripForm.labels.groupType")}</label>
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
              <p className="error-message">{errors.selectedGroupType}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tripType">{t("tripForm.labels.tripType")}</label>
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
              <p className="error-message">{errors.selectedTripType}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="days">{t("tripForm.labels.days")}</label>
            <input
              type="number"
              id="days"
              value={numberOfDays}
              onChange={handleDaysChange}
              className="form-control"
              placeholder={t("tripForm.placeholders.days")}
              min="1"
            />
            {errors.numberOfDays && (
              <p className="error-message">{errors.numberOfDays}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="country">{t("tripForm.labels.country")}</label>
            <input
              list="countries"
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              className="form-control"
              placeholder={t("tripForm.placeholders.country")}
            />
            <datalist id="countries">
              {countries.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
            {errors.selectedCountry && (
              <p className="error-message">{errors.selectedCountry}</p>
            )}
          </div>

          <button className="btn-cta-l" onClick={goToCreateTripPage}>
            {t("tripForm.nextButton")}
          </button>
        </div>
      </section>
    </>
  );
};

export default TripForm;
