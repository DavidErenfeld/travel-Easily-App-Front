import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSocket from "../../../Hooks/useSocket";
import TripCard from "../TripCard";
import tripsService, { ITrips } from "../../../services/tripsService";
import LoadingDots from "../../UIComponents/Loader";
import Header from "../../Header";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";

const FavoriteTrips = () => {
  const { t } = useTranslation();
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavoriteTrips = async () => {
      setLoading(true);
      const userID = localStorage.getItem("loggedUserId") || "";
      try {
        const data = await tripsService.getFavoriteTrips(userID);
        setTrips(data);
      } catch (error) {
        console.error(t("favoriteTrips.errorLoading"), error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteTrips();
  }, [t]);

  useSocket("likeAdded", (newTrip) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip._id === newTrip._id ? newTrip : trip))
    );
  });

  const renderFavoriteTrips = () => {
    return trips.map((trip) => (
      <article className="trip-list-item" key={trip._id}>
        <TripCard trip={trip} />
      </article>
    ));
  };

  return (
    <>
      <Header />
      <MenuBar />
      <section className="trips-section section">
        {loading ? (
          <div className="trips-loader main-loader-section">
            <LoadingDots />
          </div>
        ) : trips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("favoriteTrips.noTrips")}</p>
            <button
              onClick={() => navigate("/searchTrip")}
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
