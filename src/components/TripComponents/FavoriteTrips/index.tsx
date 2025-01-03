import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSocket from "../../../Hooks/useSocket";
import TripCard from "../TripCard";
import tripsService, { ITrips } from "../../../services/tripsService";
import LoadingDots from "../../UIComponents/Loader";
import Header from "../../Header";
import MenuBar from "../../Menus/MenuBar";
import { useTrips } from "../../../Context/TripContext";
import "./style.css";

const FavoriteTrips = () => {
  const { t } = useTranslation();
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState<number | null>(null);
  const { refreshTrips } = useTrips();
  const handleNavigateToTrip = (tripId: string) => {
    setScrollPosition(window.scrollY);
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate(`/searchTrip/trip/${tripId}`);
  };

  useEffect(() => {
    const restoreScrollPosition = () => {
      const savedScrollPosition = localStorage.getItem("scrollPosition");
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition, 10));
        }, 0);
        localStorage.removeItem("scrollPosition");
      }
    };

    const loadFavoriteTrips = async () => {
      setLoading(true);
      const userID = localStorage.getItem("loggedUserId") || "";
      try {
        const data = await tripsService.getFavoriteTrips(userID);
        setTrips(data);
        restoreScrollPosition();
      } catch (error) {
        console.error(t("favoriteTrips.errorLoading"), error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteTrips();
  }, [t, refreshTrips]);

  const renderFavoriteTrips = () => {
    return trips.map((trip) => (
      <article className="trip-list-item" key={trip._id}>
        <TripCard trip={trip} onNavigateToTrip={handleNavigateToTrip} />
      </article>
    ));
  };

  return (
    <>
      <Header />
      <MenuBar />
      <section className="trips-section section">
        <div className="trips-summary">
          <h1 className="">{`${t("favoriteTrips.title")} (${
            trips.length
          })`}</h1>
        </div>
        {loading ? (
          <div className="trips-loader main-loader-section">
            <LoadingDots />
          </div>
        ) : trips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("favoriteTrips.noTrips")}</p>
            <button
              onClick={() => navigate("/trips?title=tripsList.defaultTitle")}
              className="btn-cta-exl"
            >
              {t("favoriteTrips.exploreButton")}
            </button>
          </div>
        ) : (
          renderFavoriteTrips()
        )}
      </section>
    </>
  );
};

export default FavoriteTrips;
