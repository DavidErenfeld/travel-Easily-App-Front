import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrips } from "../../../Context/TripContext";
import TripCard from "../TripCard";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";
import "./style.css";
import MenuBar from "../../Menus/MenuBar";

const Trips = () => {
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
        setError("Failed to load trips. Please try again later.");
        console.error("Error loading trips:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, []);

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
            <p className="no-trips-message">
              No trips have been added to the system yet
            </p>
            <button className="btn-cta-exl" onClick={handleCreateTrip}>
              Create Your First Trip
            </button>
          </div>
        ) : (
          renderTrips()
        )}
      </section>
    </>
  );
};

export default Trips;
