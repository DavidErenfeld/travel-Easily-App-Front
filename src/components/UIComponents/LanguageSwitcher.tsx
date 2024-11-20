import ReactCountryFlag from "react-country-flag";
import i18n from "../../i18n";

const LanguageSwitcher = () => {
  const currentLanguage = i18n.language;
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "he" : "en";
    i18n.changeLanguage(newLanguage);
    document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr";
  };

  return (
    <div onClick={toggleLanguage} style={{ cursor: "pointer" }}>
      {currentLanguage === "en" ? (
        <ReactCountryFlag
          countryCode="IL"
          svg
          style={{
            width: "3rem",
            height: "3rem",
          }}
          title="עברית"
        />
      ) : (
        <ReactCountryFlag
          countryCode="US"
          svg
          style={{
            width: "3rem",
            height: "3rem",
          }}
          title="English"
        />
      )}
    </div>
  );
};
export default LanguageSwitcher;
