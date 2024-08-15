// components/Trips/index.tsx
import React from "react";
import TripCard from "../TripCard";
import "./style.css";
import LoadingDots from "../../UIComponents/Loader";
import { useTrips } from "../../../Context/TripContext";

const Trips = () => {
  const { trips, refreshTrips } = useTrips();

  const renderTrips = () => {
    return trips.map((trip) => (
      <article className="trip-list-item" key={trip._id}>
        <TripCard trip={trip} />
      </article>
    ));
  };

  React.useEffect(() => {
    refreshTrips();
  }, []);

  return (
    <section className="trips-section">
      {trips.length === 0 ? (
        <div className="main-loader-section">
          <LoadingDots />
        </div>
      ) : (
        renderTrips()
      )}
    </section>
  );
};

export default Trips;
