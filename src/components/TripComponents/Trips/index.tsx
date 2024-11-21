import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTrips } from "../../../Context/TripContext";
import TripCard from "../TripCard";
import Header from "../../Header";
import MenuBar from "../../Menus/MenuBar";

const TripsList = () => {
  const { t } = useTranslation();
  const { country } = useParams<{ country: string }>();
  const { trips } = useTrips();
  const navigate = useNavigate();

  const handleNavigateToTrip = (tripId: string) => {
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
    restoreScrollPosition();
  }, []);

  const filteredTrips = trips.filter(
    (trip) => trip.country.toLowerCase() === country?.toLowerCase()
  );

  return (
    <>
      <Header />
      <MenuBar />
      <section className="trips-section section">
        {filteredTrips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("tripsList.noTripsMessage")}</p>
            <button
              className="btn-cta-exl"
              onClick={() => navigate(`/secontHomPage`)}
            >
              {t("tripsList.backToDestinations")}
            </button>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onNavigateToTrip={handleNavigateToTrip}
            />
          ))
        )}
      </section>
    </>
  );
};

export default TripsList;
