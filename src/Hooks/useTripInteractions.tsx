import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import tripsService from "../services/tripsService";
import useTripCard from "../Hooks/useTripCard"; // using the original hook

const useTripInteractions = (trip: any) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Using useTripCard to manage likes, favorites, and comments
  const {
    isLiked,
    numOfLikes,
    numOfComments,
    toggleLike,
    isFavorite,
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
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      toggleLike(); // Using function from useTripCard
    }
  };

  // Handle favorite click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      toggleFavorite(); // Using function from useTripCard
      setSuccessMessage(
        isFavorite ? "Trip removed from favorites!" : "Trip added to favorites!"
      );
    }
  };

  // Handle share (does not require server communication)
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

  // Handle showing likes details
  const handleLikesClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = await tripsService.getLikesDetails(trip._id || "");
      setLikesDetails(data.likesDetails);
      setShowLikesDetails(true);
    } catch (error) {
      console.error("Failed to fetch likes details:", error);
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
    handleLikesClick,
    setShowLikesDetails,
    setSuccessMessage,
  };
};

export default useTripInteractions;
