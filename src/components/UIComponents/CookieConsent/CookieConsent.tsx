import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CookieConsent.module.css";

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookies_accepted");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles["text-wrapper"]}>
        <p className={styles.text}>{t("cookieConsent.message")}</p>
        <a href="/privacy-policy" className={styles.link}>
          {t("cookieConsent.learnMore")}
        </a>
      </div>
      <button onClick={handleAccept} className={styles.button}>
        {t("cookieConsent.accept")}
      </button>
    </div>
  );
};

export default CookieConsent;
