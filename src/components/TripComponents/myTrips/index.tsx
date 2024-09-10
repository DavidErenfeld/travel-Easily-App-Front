import { useEffect, useState } from "react";
import TripCard from "../TripCard";
import "./style.css";
import LoadingDots from "../../UIComponents/Loader";
import tripsService, { ITrips } from "../../../services/tripsService";
import Header from "../../Header";

const MyTrips = () => {
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [loading, setLoading] = useState(true);
  const loggedUserId = localStorage.getItem("loggedUserId");

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

  const renderMyTrips = () => {
    return trips.map((trip) => (
      <article className="trip-list-item" key={trip._id}>
        <TripCard trip={trip} />
      </article>
    ));
  };

  return (
    <>
      <Header />
      <section className="trips-section">
        {loading ? (
          <div className="main-loader-section">
            <LoadingDots />
          </div>
        ) : trips.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          renderMyTrips()
        )}
      </section>
    </>
  );
};

export default MyTrips;
