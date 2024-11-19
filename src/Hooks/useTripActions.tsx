// useTripActions.ts
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import tripsService, { ITrips } from "../services/tripsService";
import { useTrips } from "../Context/TripContext";
import { addFavoriteTrip, removeFavoriteTrip } from "../services/usersService";
import socket from "./socketInstance";
import TripCard from "../components/TripComponents/TripCard";
import TripDetails from "../components/TripComponents/TripDetails";

const useTripActions = (trip: ITrips | null) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { trips, setTrips } = useTrips();

  const currentTrip = trips.find((t) => t._id === trip?._id);

  const [isLiked, setIsLiked] = useState(
    currentTrip?.isLikedByCurrentUser || false
  );
  const [numOfLikes, setNumOfLikes] = useState(currentTrip?.numOfLikes || 0);
  const [isFavorite, setIsFavorite] = useState(
    currentTrip?.isFavoritedByCurrentUser || false
  );
  const [numOfComments, setNumOfComments] = useState(
    currentTrip?.numOfComments || 0
  );

  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [likesDetails, setLikesDetails] = useState<
    Array<{ userName: string; imgUrl: string }>
  >([]);
  const [showLikesDetails, setShowLikesDetails] = useState(false);

  // עדכון הסטייט המקומי כאשר הסטייט הגלובלי משתנה
  useEffect(() => {
    setIsLiked(currentTrip?.isLikedByCurrentUser || false);
    setNumOfLikes(currentTrip?.likes?.length || 0);
    setIsFavorite(currentTrip?.isFavoritedByCurrentUser || false);
    setNumOfComments(currentTrip?.numOfComments || 0);
  }, [
    currentTrip?.isLikedByCurrentUser,
    currentTrip?.numOfLikes,
    currentTrip?.isFavoritedByCurrentUser,
    currentTrip?.numOfComments,
    trip,
    TripCard,
    TripDetails,
  ]);

  // טיפול בלחיצה על לייק
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const newIsLiked = !isLiked;

      try {
        await tripsService.addLike(trip?._id!);
      } catch (error) {
        setIsLiked(!newIsLiked);
        setNumOfLikes(newIsLiked ? numOfLikes - 1 : numOfLikes + 1);

        setTrips((prevTrips) =>
          prevTrips.map((t) =>
            t._id === trip?._id
              ? {
                  ...t,
                  isLikedByCurrentUser: !newIsLiked,
                  numOfLikes: newIsLiked ? t.numOfLikes - 1 : t.numOfLikes + 1,
                }
              : t
          )
        );
        console.error("Failed to toggle like:", error);
      }
    }
  };

  // טיפול בלחיצה על מועדף
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const newIsFavorite = !isFavorite;

      // עדכון אופטימי של הסטייט המקומי והגלובלי
      setIsFavorite(newIsFavorite);

      setTrips((prevTrips) =>
        prevTrips.map((t) =>
          t._id === trip?._id
            ? {
                ...t,
                isFavoritedByCurrentUser: newIsFavorite,
              }
            : t
        )
      );

      try {
        if (newIsFavorite) {
          await addFavoriteTrip(trip?._id!);
          setSuccessMessage("Trip added to favorites!");

          // שליחת אירוע לשרת דרך Socket.IO
          socket.emit("addFavorite", {
            tripId: trip?._id,
            userId: user?._id,
          });
        } else {
          await removeFavoriteTrip(trip?._id!);
          setSuccessMessage("Trip removed from favorites!");

          // שליחת אירוע לשרת דרך Socket.IO
          socket.emit("removeFavorite", {
            tripId: trip?._id,
            userId: user?._id,
          });
        }
      } catch (error) {
        // החזרת הסטייט למצב הקודם במקרה של שגיאה
        setIsFavorite(!newIsFavorite);

        setTrips((prevTrips) =>
          prevTrips.map((t) =>
            t._id === trip?._id
              ? {
                  ...t,
                  isFavoritedByCurrentUser: !newIsFavorite,
                }
              : t
          )
        );

        console.error("Failed to toggle favorite:", error);
      }
    }
  };

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

  // טיפול בלחיצה על כפתור השיתוף (נשאר ללא שינוי)
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Amazing trip to ${trip?.country}`,
          text: `Join me on this journey to ${trip?.country}!`,
          url: `https://travel-easily-app.netlify.app/searchTrip/trip/${trip?._id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setIsShareClicked(!isShareClicked);
    }
  };

  // טיפול בסגירת המודל עם אנימציה (נשאר ללא שינוי)
  const handleModalClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowLikesDetails(false);
      setIsExiting(false);
    }, 300); // זמן האנימציה במילישניות
  };

  return {
    isLiked,
    numOfLikes,
    numOfComments,
    isFavorite,
    isShareClicked,
    isExiting,
    modalRef,
    successMessage,
    likesDetails,
    showLikesDetails,
    handleLikeClick,
    handleFavoriteClick,
    handleShareClick,
    handleLikesClick,
    handleModalClose,
    setShowLikesDetails,
    setSuccessMessage,
  };
};

export default useTripActions;
