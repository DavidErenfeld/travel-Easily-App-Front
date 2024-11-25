import { useTranslation } from "react-i18next";
import { Shield, Info, Database, Mail } from "lucide-react";
import "./style.css";
import Header from "../../Header";
import Footer from "../../Home/Footer";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <div className="privacy-policy-container">
        <div className="flex-center-column">
          <h1 className="privacy-policy-title">{t("privacyPolicy.title")}</h1>
          <p className="privacy-policy-subtitle">{t("privacyPolicy.intro")}</p>
        </div>
        <div className="privacy-policy-item">
          <h2 className="subtitle-text">
            <Info className="icon" /> {t("privacyPolicy.aboutTitle")}
          </h2>
          <p className="privacy-policy-text">
            {t("privacyPolicy.aboutDescription")}
          </p>
        </div>
        <div className="privacy-policy-item">
          <h2 className="subtitle-text">
            <Shield className="icon" /> {t("privacyPolicy.cookiesTitle")}
          </h2>
          <p className="privacy-policy-text">
            {t("privacyPolicy.cookiesDescription")}
          </p>
        </div>
        <div className="privacy-policy-item">
          <h2 className="subtitle-text">
            <Database className="icon" /> {t("privacyPolicy.dataTitle")}
          </h2>
          <p className="privacy-policy-text">
            {t("privacyPolicy.dataDescription")}
          </p>
        </div>
        <div className="privacy-policy-item">
          <h2 className="subtitle-text">
            <Mail className="icon" /> {t("privacyPolicy.contactTitle")}
          </h2>
          <p className="privacy-policy-text">
            {t("privacyPolicy.contactDescription")}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
