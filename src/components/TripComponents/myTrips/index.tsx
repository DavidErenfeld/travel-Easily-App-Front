import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tripsService, { ITrips } from "../../../services/tripsService";
import useSocket from "../../../Hooks/useSocket";
import TripCard from "../TripCard";
import Header from "../../Header";
import LoadingDots from "../../UIComponents/Loader";
import MenuBar from "../../Menus/MenuBar";
import "./style.css";

const MyTrips = () => {
  const { t } = useTranslation();
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
        console.error(t("myTrips.errorLoading"), error);
      } finally {
        setLoading(false);
      }
    };

    if (loggedUserId) {
      loadMyTrips();
    }
  }, [loggedUserId, t]);

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
        <div className="trips-summary">
          {/* <button className="btn-summary">
            {`${trips.length} ${t("tripsList.tripsFound")}`}
          </button> */}
          {/* <div className="flex-center-gap-s"> */}
          {/* <p> {`(${trips.length})`}</p> */}
          <h1 className="">{`${t("myTrips.title")} (${trips.length})`}</h1>
          {/* </div> */}
        </div>
        {loading ? (
          <div className="trips-loader main-loader-section">
            <LoadingDots />
          </div>
        ) : trips.length === 0 ? (
          <div className="no-trips-container">
            <p className="no-trips-message">{t("myTrips.noTrips")}</p>
            <button className="btn-cta-exl" onClick={handleCreateTrip}>
              {t("myTrips.createTripButton")}
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
