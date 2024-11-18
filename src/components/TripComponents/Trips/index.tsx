import { useNavigate, useParams } from "react-router-dom";
import { useTrips } from "../../../Context/TripContext";
import TripCard from "../TripCard";
import Header from "../../Header";
import MenuBar from "../../Menus/MenuBar";

const TripsList = () => {
  const { country } = useParams<{ country: string }>(); // קבלת פרמטר המדינה
  const { trips } = useTrips();
  const navigate = useNavigate();
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
            <p className="no-trips-message">
              No trips found for your search criteria.
            </p>
            <button
              className="btn-cta-exl"
              onClick={() => navigate(`/secontHomPage`)}
            >
              Back to Destinations
            </button>
          </div>
        ) : (
          filteredTrips.map((trip) => <TripCard key={trip._id} trip={trip} />)
        )}
      </section>
    </>
  );
};
export default TripsList;
