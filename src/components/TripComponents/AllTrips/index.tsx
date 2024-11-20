import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTrips } from "../../../Context/TripContext";
import TripCard from "../TripCard";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";

const AllTrips = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trips, refreshTrips } = useTrips();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await refreshTrips();
      } catch (err) {
        setError(t("allTrips.error"));
        console.error(t("allTrips.errorConsole"), err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, [t]);

  const renderTrips = () => {
    return trips.map((trip) => (
      <article className="trip-list-item" key={trip._id}>
        <TripCard trip={trip} />
      </article>
    ));
  };

  const handleCreateTrip = () => {
    navigate("/AddTrip");
  };

  return (
    <>
      <Header />
      <MenuBar />
      <section className="trips-section">
        {isLoading ? (
          <LoadingDots />
        ) : error ? (
          <div className="main-loader-section">
            <h1>{error}</h1>
          </div>
        ) : trips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("allTrips.noTrips")}</p>
            <button className="btn-cta-exl" onClick={handleCreateTrip}>
              {t("allTrips.createTripButton")}
            </button>
          </div>
        ) : (
          renderTrips()
        )}
      </section>
    </>
  );
};

export default AllTrips;