import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaShareAlt, FaThumbsUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import tripsService, { ITrips } from "../../../services/tripsService";
import TripHeader from "../TripHeader";
import useTripCard from "../../../Hooks/useTripCard";
import TripDescription from "../TripDescription";
import ShareButtons from "../../UIComponents/ShareButtons";
import SuccessMessage from "../../UIComponents/SuccessMessage";
import { Heart, ThumbsUp, Share2, X } from "lucide-react";
import "./style.css";
import CloseIcon from "../../UIComponents/Icons/Close";
// import React, { useState, useEffect, useRef } from "react";

interface TripCardProps {
  trip: ITrips;
}
// ... שאר הייבוא נשאר כמות שהוא

const TripCard = ({ trip }: TripCardProps) => {
  const {
    isLiked,
    numOfLikes,
    numOfComments,
    toggleLike,
    isFavorite,
    toggleFavorite,
  } = useTripCard(trip);

  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [likesDetails, setLikesDetails] = useState<
    Array<{ userName: string; imgUrl: string }>
  >([]);
  const [showLikesDetails, setShowLikesDetails] = useState(false);
  const { isAuthenticated } = useAuth();
  const likeColor = isLiked ? "true" : "false";
  const favoriteColor = isFavorite ? "true" : "false";

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      toggleLike();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      toggleFavorite();
      setSuccessMessage(
        isFavorite ? "Trip removed from favorites!" : "Trip added to favorites!"
      );
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Amazing trip to ${trip.country}`,
          text: `Join me on this journey to ${trip.country}!`,
          url: `https://travel-easily-app.netlify.app/searchTrip/trip/${trip._id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      if (isShareClicked) {
        setIsExiting(true);
        setTimeout(() => {
          setIsShareClicked(false);
          setIsExiting(false);
        }, 1000);
      } else {
        setIsShareClicked(true);
      }
    }
  };

  const handleLikesClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = await tripsService.getLikesDetails(trip._id || "");
      console.log(data);
      setLikesDetails(data.likesDetails);
      setShowLikesDetails(true);
    } catch (error) {
      console.error("Failed to fetch likes details:", error);
    }
  };

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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLikesDetails]);

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
      <div className="icons-details flex-space-between ">
        <div className="icons">
          <div className="icons-area">
            <ThumbsUp
              onClick={handleLikeClick}
              className={`icon ${likeColor}`}
            />
          </div>
          <div className="icons-area">
            <Heart
              onClick={handleFavoriteClick}
              className={`icon ${favoriteColor}`}
            />
          </div>
          <Share2 className="icon share-icon" onClick={handleShareClick} />
        </div>
        {isShareClicked && !navigator.share && (
          <div className="trip-card-share-buttons">
            <ShareButtons
              url={`https://travel-easily-app.netlify.app/searchTrip/trip/${trip._id}`}
              text={`Amazing trip to ${trip.country}! Join me on this adventure!`}
              className={isExiting ? "hide" : "show"}
            />
          </div>
        )}
        <div className="coments-and-likes-details">
          <p onClick={() => navigate(`/searchTrip/trip/${trip._id}`)}>
            {numOfComments} comments
          </p>
          <p onClick={handleLikesClick}>{numOfLikes} likes </p>
          {showLikesDetails && likesDetails.length > 0 && (
            <div
              ref={modalRef}
              className={`likes-details-modal ${
                showLikesDetails ? "show" : ""
              }`}
            >
              <X onClick={() => setShowLikesDetails(false)} className="icon" />
              {likesDetails.map((like, index) => (
                <ul key={index}>
                  <span>{like.userName}</span>
                  <img
                    src={like.imgUrl || "/images/user.png"}
                    alt="User profile"
                  />
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>

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
