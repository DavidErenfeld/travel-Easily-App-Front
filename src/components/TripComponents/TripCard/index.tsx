import React, { useState } from "react";
import { FaHeart, FaRegComment, FaShareAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import TripHeader from "../TripHeader";
import { useAuth } from "../../../Context/AuthContext";
import useTripCard from "../../../Hooks/useTripCard";
import { ITrips } from "../../../services/tripsService";
import TripDescription from "../TripDescription";
import "./style.css";
import ShareButtons from "../ShareButtons";

interface TripCardProps {
  trip: ITrips;
}

const TripCard = ({ trip }: TripCardProps) => {
  const { isLiked, numOfLikes, numOfComments, toggleLike } = useTripCard(trip);
  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const likeColor = isLiked ? "blue" : "white";

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      toggleLike();
    }
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/searchTrip/trip/${trip._id}`);
  };

  const handleShareClick = () => {
    if (isShareClicked) {
      setIsExiting(true); // מתחילים אנימציית יציאה
      setTimeout(() => {
        setIsShareClicked(false); // מסתירים לאחר שהאנימציה מסתיימת
        setIsExiting(false); // מאפסים את מצב היציאה
      }, 1000); // טיימר באורך זמן האנימציה (1 שנייה)
    } else {
      setIsShareClicked(true); // מציגים את הכפתורים
    }
  };

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
      <div className="icons">
        <div className="icons-area">
          <span>{numOfLikes}</span>
          <FaHeart
            onClick={handleLikeClick}
            className={`like-icon ${likeColor}`}
          />
        </div>
        <div className="icons-area" onClick={handleCommentsClick}>
          <span>{numOfComments}</span>
          <FaRegComment />
        </div>
        <FaShareAlt className="share-icon" onClick={handleShareClick} />

        {isShareClicked && (
          <div className="trip-card-share-buttons">
            <ShareButtons
              url={`https://travel-easily-app.netlify.app/searchTrip/trip/${trip._id}`}
              text={`Amazing trip to ${trip.country}! Join me on this adventure!`}
              className={isExiting ? "hide" : "show"}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default TripCard;
