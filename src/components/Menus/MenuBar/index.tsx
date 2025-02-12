import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";

const MenuBar = () => {
  const { t } = useTranslation();
  const location = useLocation(); // מקבל את ה-URL הנוכחי

  return (
    <section className="menu-bar">
      <Link to="/searchTrip/advancedSearch">
        <div className={`menu-sub-item ${location.pathname === "/searchTrip/advancedSearch" ? "active" : ""}`}>
          {t("menuBar.advancedSearch")}
        </div>
      </Link>
      <Link to="/secontHomPage">
        <div className={`menu-sub-item ${location.pathname === "/secontHomPage" ? "active" : ""}`}>
          {t("menuBar.selectedDestinations")}
        </div>
      </Link>
      <Link to="/trips">
        <div className={`menu-sub-item ${location.pathname.startsWith("/trips") ? "active" : ""}`}>
          {t("menuBar.allTrips")}
        </div>
      </Link>
      <Link to="/myTrips">
        <div className={`menu-sub-item ${location.pathname === "/myTrips" ? "active" : ""}`}>
          {t("menuBar.myTrips")}
        </div>
      </Link>
      <Link to="/favoriteTrips">
        <div className={`menu-sub-item ${location.pathname === "/favoriteTrips" ? "active" : ""}`}>
          {t("menuBar.favoriteTrips")}
        </div>
      </Link>
      <Link to="/addTrip">
        <div className={`menu-sub-item ${location.pathname === "/addTrip" ? "active" : ""}`}>
          {t("menuBar.addTrip")}
        </div>
      </Link>
      <Link to="/tripForm">
        <div className={`menu-sub-item ${location.pathname === "/tripForm" ? "active" : ""}`}>
          {t("menuBar.exploreNearby")}
        </div>
      </Link>
    </section>
  );
};

export default MenuBar;
