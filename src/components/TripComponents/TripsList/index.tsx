import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTrips } from "../../../Context/TripContext";
import TripCard from "../TripCard";
import Header from "../../Header";
import MenuBar from "../../Menus/MenuBar";
import LoadingDots from "../../UIComponents/Loader";
import "./style.css";

const TripsList = () => {
  const { t } = useTranslation();
  const { trips, loadTrips, contextLoading, hasMore, resetTrips } = useTrips();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    resetTrips();
    setCurrentPage(1);
    loadTrips(1, limit);
  }, [searchParams]);

  const loadMore = useCallback(async () => {
    if (contextLoading || !hasMore) return;
    const nextPage = currentPage + 1;
    await loadTrips(nextPage, limit);
    setCurrentPage(nextPage);
  }, [currentPage, contextLoading, hasMore, loadTrips, limit]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const handleNavigateToTrip = (tripId: string) => {
    localStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate(`/searchTrip/trip/${tripId}`);
  };

  const country = searchParams.get("country")?.toLowerCase() || "";
  const numOfDays = searchParams.get("numOfDays");
  const typeTrip = searchParams.get("typeTrip")?.toLowerCase() || "";
  const typeTraveler = searchParams.get("typeTraveler")?.toLowerCase() || "";
  const titleKey = searchParams.get("title") || "tripsList.defaultTitle";
  const pageTitle = t(titleKey);

  const filteredTrips = trips.filter((trip) => {
    const isCountryMatch = country
      ? trip.country.toLowerCase() === country
      : true;
    const isDaysMatch = numOfDays
      ? trip.tripDescription.length === parseInt(numOfDays, 10)
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
        <div className="trips-summary">
          <h1>{`${pageTitle} `}</h1>
        </div>
        {contextLoading && trips.length === 0 ? (
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
          <>
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onNavigateToTrip={handleNavigateToTrip}
              />
            ))}
            {contextLoading && <LoadingDots />}
          </>
        )}
      </section>
    </>
  );
};

export default TripsList;
