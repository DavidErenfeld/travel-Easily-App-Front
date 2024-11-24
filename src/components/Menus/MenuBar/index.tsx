import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";

const MenuBar = () => {
  const { t } = useTranslation();

  return (
    <section className="menu-bar">
      <Link to="/searchTrip/advancedSearch">
        <div className="menu-sub-item">{t("menuBar.advancedSearch")}</div>
      </Link>
      <Link to="/secontHomPage">
        <div className="menu-sub-item">{t("menuBar.selectedDestinations")}</div>
      </Link>
      <Link to="/trips?title=tripsList.defaultTitle">
        <div className="menu-sub-item">{t("menuBar.allTrips")}</div>
      </Link>
      <Link to="/myTrips">
        <div className="menu-sub-item">{t("menuBar.myTrips")}</div>
      </Link>
      <Link to="/favoriteTrips">
        <div className="menu-sub-item">{t("menuBar.favoriteTrips")}</div>
      </Link>
      <Link to="/addTrip">
        <div className="menu-sub-item">{t("menuBar.addTrip")}</div>
      </Link>
      <Link to="/tripForm">
        <div className="menu-sub-item">{t("menuBar.exploreNearby")}</div>
      </Link>
    </section>
  );
};

export default MenuBar;
