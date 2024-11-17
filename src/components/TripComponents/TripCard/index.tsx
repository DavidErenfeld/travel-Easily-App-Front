import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ITrips } from "../../../services/tripsService";
import TripHeader from "../TripHeader";
import TripDescription from "../TripDescription";
import TripCardIcons from "../TripCardIcons";
import SuccessMessage from "../../UIComponents/SuccessMessage";
import "./style.css";
import useTripActions from "../../../Hooks/useTripActions";

interface TripCardProps {
  trip: ITrips;
}

const TripCard = ({ trip }: TripCardProps) => {
  const {
    isLiked,
    numOfLikes,
    numOfComments,
    isFavorite,
    isShareClicked,
    isExiting,
    successMessage,
    likesDetails,
    showLikesDetails,
    modalRef,
    handleLikeClick,
    handleFavoriteClick,
    handleShareClick,
    handleLikesClick,
    setShowLikesDetails,
    setSuccessMessage,
  } = useTripActions(trip);

  // Updated event listener to close likes details modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowLikesDetails(false);
      }
    };

    if (showLikesDetails) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLikesDetails, modalRef]);

  return (
    <section className="trip-card">
      <div className="trip-card-profile">
        <img
          className="user-profile"
          src={trip.owner?.imgUrl || "/images/user.png"}
          alt="Profile"
        />
        <p className="profile-name">{trip.userName}</p>
      </div>
      {trip && <TripHeader trip={trip} />}
      <Link to={`/searchTrip/trip/${trip._id}`} className="trip-card-link">
        <div className="trip-description">
          <TripDescription trip={trip} />
        </div>
      </Link>
      
      <TripCardIcons
        tripId={trip._id || ""}
        country={trip.country}
        numOfComments={numOfComments}
        numOfLikes={numOfLikes}
        isLiked={isLiked}
        isFavorite={isFavorite}
        isShareClicked={isShareClicked}
        isExiting={isExiting}
        likesDetails={likesDetails}
        showLikesDetails={showLikesDetails}
        handleLikeClick={handleLikeClick}
        handleFavoriteClick={handleFavoriteClick}
        handleShareClick={handleShareClick}
        handleLikesClick={handleLikesClick}
        setShowLikesDetails={setShowLikesDetails}
        modalRef={modalRef}
      />

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onAnimationEnd={() => setSuccessMessage(null)}
        />
      )}
    </section>
  );
};

export default TripCard;
