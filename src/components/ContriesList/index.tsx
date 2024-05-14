import "./style.css";
import "../../App.css";
import "../MultiSelect/style.css";
import { useEffect, useState } from "react";

interface Country {
  name: {
    common: string;
  };
}

interface ContriesListProps {
  // selectedCountry: string;
  saveCountryName: (country: string) => void;
}

const CountriesList = ({ saveCountryName }: ContriesListProps) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [countryName, setCountryName] = useState("Type country name");
  const [isOpen, setIsOpen] = useState(true);

  const fetchCountries = async (countryName: string) => {
    if (!countryName) return;
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const countriesData: Country[] = await response.json();
      const newCountries = countriesData.map((country) => country.name.common);
      setCountries(newCountries);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    }
  };

  useEffect(() => {
    if (inputValue.trim() !== "") {
      fetchCountries(inputValue);
    } else {
      setCountries([]);
    }
  }, [inputValue]);

  const handleCountryClick = (country: string) => {
    setCountryName(country);
    setInputValue(country);
    saveCountryName(country);
    setIsOpen(false);
  };

  return (
    <section className="countries-list-container flex-center-column">
      <input
        type="text"
        placeholder={`${countryName}`}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <div className="countries-container">
          {countries.map((country, index) => (
            <p
              className="option"
              key={index}
              onClick={() => handleCountryClick(country)}
            >
              {country}
            </p>
          ))}
        </div>
      )}
    </section>
  );
};

export default CountriesList;
