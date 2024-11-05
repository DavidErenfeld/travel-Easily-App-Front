import { useEffect, useState } from "react";
import useSocket from "../../../Hooks/useSocket";
import TripCard from "../TripCard";
import tripsService, { ITrips } from "../../../services/tripsService";
import LoadingDots from "../../UIComponents/Loader";
import Header from "../../Header";
import { useNavigate } from "react-router-dom";
import "./style.css";

const FavoriteTrips = () => {
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
        console.error("Failed to load favorite trips:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteTrips();
  }, []);

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
      <section className="trips-section section">
        {loading ? (
          <div className="trips-loader main-loader-section">
            <LoadingDots />
          </div>
        ) : trips.length === 0 ? (
          <div className="main-loader-section">
            <h1>You don't have any favorite trips yet</h1>
          </div>
        ) : (
          renderFavoriteTrips()
        )}
      </section>
    </>
  );
};

export default FavoriteTrips;