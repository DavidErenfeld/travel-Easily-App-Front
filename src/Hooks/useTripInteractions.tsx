import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import useTripCard from "./useTripCard"; // שימוש בהוק useTripCard
import tripsService, { ITrips } from "../services/tripsService";

const useTripInteractions = (trip: ITrips | null) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // שימוש בהוק useTripCard לניהול לייקים ומועדפים
  const {
    isLiked,
    numOfLikes,
    numOfComments,
    isFavorite,
    toggleLike,
    toggleFavorite,
  } = useTripCard(trip);

  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [likesDetails, setLikesDetails] = useState<
    Array<{ userName: string; imgUrl: string }>
  >([]);
  const [showLikesDetails, setShowLikesDetails] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle like click
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      await toggleLike(); // קריאה לפונקציה מתוך useTripCard
    }
  };

  // Handle favorite click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      toggleFavorite(); // קריאה לפונקציה מתוך useTripCard
      setSuccessMessage(
        isFavorite ? "Trip removed from favorites!" : "Trip added to favorites!"
      );
    }
  };

  // Handle likes click to show details in modal
  const handleLikesClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = await tripsService.getLikesDetails(trip?._id || "");
      setLikesDetails(data.likesDetails);
      setShowLikesDetails(true);
    } catch (error) {
      console.error("Failed to fetch likes details:", error);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Amazing trip to ${trip?.country}`,
          text: `Join me on this journey to ${trip?.country}`!,
          url: `https://travel-easily-app.netlify.app/searchTrip/trip/${trip?._id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setIsShareClicked(!isShareClicked);
    }
  };

  return {
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
    handleLikesClick, // כאן הוספנו את הפונקציה
    setShowLikesDetails,
    setSuccessMessage,
  };
};

export default useTripInteractions;
