import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tripsService, { ITrips } from "../../../services/tripsService";
import useSocket from "../../../Hooks/useSocket";
import TripCard from "../TripCard";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";
import "./style.css";
import MenuBar from "../../Menus/MenuBar";

const MyTrips = () => {
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [loading, setLoading] = useState(true);
  const loggedUserId = localStorage.getItem("loggedUserId");
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyTrips = async () => {
      setLoading(true);
      try {
        const data = (await tripsService.getByOwnerId(
          loggedUserId!
        )) as ITrips[];
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loggedUserId) {
      loadMyTrips();
    }
  }, [loggedUserId]);

  useSocket("likeAdded", (newTrip) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip._id === newTrip._id ? newTrip : trip))
    );
  });

  const renderMyTrips = () => {
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
      <section className="trips-section section">
        {loading ? (
          <div className="trips-loader main-loader-section">
            <LoadingDots />
          </div>
        ) : trips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">You have no trips yet.</p>
            <button className="btn-cta-exl" onClick={handleCreateTrip}>
              Create Your First Trip
            </button>
          </div>
        ) : (
          renderMyTrips()
        )}
      </section>
    </>
  );
};

export default MyTrips;
