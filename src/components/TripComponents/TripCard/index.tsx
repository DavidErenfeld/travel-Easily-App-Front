import { useEffect } from "react";
import i18n from "../../../i18n";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ITrips } from "../../../services/tripsService";
import TripHeader from "../TripHeader";
import TripDescription from "../TripDescription";
import TripCardIcons from "../TripCardIcons";
import SuccessMessage from "../../UIComponents/SuccessMessage";
import useTripActions from "../../../Hooks/useTripActions";
import "./style.css";

interface TripCardProps {
  trip: ITrips;
  onNavigateToTrip?: (tripSlug: string) => void;
}

const TripCard = ({ trip, onNavigateToTrip }: TripCardProps) => {
  const { t } = useTranslation();
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
      <div
        className={
          i18n.language === "he"
            ? "trip-card-profile-right"
            : "trip-card-profile-left"
        }
        dir={i18n.language === "he" ? "rtl" : "ltr"}
      >
        <img
          className="user-profile"
          src={trip.owner?.imgUrl || "/images/user.png"}
          alt={t("tripCard.altProfile")}
        />
        <p className="profile-name">{trip.owner?.userName || ""}</p>
      </div>
      {trip && <TripHeader trip={trip} />}
      {onNavigateToTrip ? (
        <div
          onClick={() => onNavigateToTrip(trip.slug || "")}
          className="trip-card-link"
          role="button"
          tabIndex={0}
          onKeyPress={(e) =>
            e.key === "Enter" && onNavigateToTrip(trip.slug || "")
          }
        >
          <div className="trip-description">
            <TripDescription trip={trip} />
          </div>
        </div>
      ) : (
        <Link to={`/searchTrip/trip/${trip.slug}`} className="trip-card-link">
          <div className="trip-description">
            <TripDescription trip={trip} />
          </div>
        </Link>
      )}

      <TripCardIcons
        slug={trip.slug || ""}
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
          messageKey={
            isFavorite
              ? "successMessages.fivoriteAdded"
              : "successMessages.fivoriteRemoved"
          }
          onAnimationEnd={() => setSuccessMessage(null)}
        />
      )}
    </section>
  );
};

export default TripCard;
