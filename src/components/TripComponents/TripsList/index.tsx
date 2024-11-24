import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTrips } from "../../../Context/TripContext";
import TripCard from "../TripCard";
import Header from "../../Header";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";
import LoadingDots from "../../UIComponents/Loader";

const TripsList = () => {
  const { t } = useTranslation();
  const { trips } = useTrips();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

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

    // סימולציית טעינה
    const simulateLoading = setTimeout(() => {
      setLoading(false); // מסיימים את מצב הטעינה
    }, 1000); // זמן טעינה מדומה של 1 שניה

    restoreScrollPosition();
    return () => clearTimeout(simulateLoading);
  }, []);

  const country = searchParams.get("country")?.toLowerCase() || "";
  const numOfDays = searchParams.get("numOfDays");
  const typeTrip = searchParams.get("typeTrip")?.toLowerCase() || "";
  const typeTraveler = searchParams.get("typeTraveler")?.toLowerCase() || "";

  const filteredTrips = trips.filter((trip) => {
    const isCountryMatch = country
      ? trip.country.toLowerCase() === country
      : true;
    const isDaysMatch = numOfDays
      ? trip.numOfDays === parseInt(numOfDays, 10)
      : true;
    const isTripTypeMatch = typeTrip
      ? trip.typeTrip.toLowerCase() === typeTrip
      : true;
    const isTravelerTypeMatch = typeTraveler
      ? trip.typeTraveler.toLowerCase() === typeTraveler
      : true;

    return (
      isCountryMatch && isDaysMatch && isTripTypeMatch && isTravelerTypeMatch
    );
  });

  return (
    <>
      <Header />
      <MenuBar />
      <section className="trips-section section">
        {loading ? (
          <LoadingDots />
        ) : filteredTrips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("tripsList.noTripsMessage")}</p>
            <button
              className="btn-cta-exl"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
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
