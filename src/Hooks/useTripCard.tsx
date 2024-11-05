import { useEffect, useState } from "react";
import tripsService, { ITrips } from "../services/tripsService";
import useSocket from "./useSocket";
import { addFavoriteTrip, removeFavoriteTrip } from "../services/usersService";
import { io } from "socket.io-client";
const socket = io("https://evening-bayou-77034-176dc93fb1e1.herokuapp.com", {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accessToken"),
  },
});
const useTripCard = (trip: ITrips) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(trip.numOfLikes);
  const [numOfComments, setNumOfComments] = useState(trip.numOfComments);

  const { send } = useSocket();

  useEffect(() => {
    const fetchStatus = async () => {
      const userId = localStorage.getItem("loggedUserId");
      if (!userId) return;

      try {
        const updatedTrip = await tripsService.getByTripId(trip._id!);
        const liked =
          updatedTrip.likes?.some((like) => like.owner === userId) || false;
        setIsLiked(liked);
        setNumOfLikes(updatedTrip.numOfLikes);
        setNumOfComments(updatedTrip.numOfComments);

        const favoriteTrips = await tripsService.getFavoriteTripIds(userId);
        setIsFavorite(favoriteTrips.includes(trip._id!));
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();

    // התחלת האזנה לאירוע commentAdded
    const handleCommentAdded = async (updatedTrip: any) => {
      if (updatedTrip._id === trip._id) {
        try {
          console.log("Fetching updated trip data after comment added...");
          const refreshedTrip = await tripsService.getByTripId(trip._id!); // קריאה ל-API לקבלת הנתונים המעודכנים
          setNumOfComments(refreshedTrip.numOfComments); // עדכון מספר התגובות
          console.log("Updated numOfComments:", refreshedTrip.numOfComments);
        } catch (error) {
          console.error("Failed to fetch updated trip data:", error);
        }
      }
    };

    // רישום מאזינים לאירועים פעם אחת בלבד
    socket.on("commentAdded", handleCommentAdded);

    return () => {
      socket.off("commentAdded", handleCommentAdded); // הסרת מאזין כשיוצאים מהמסך
    };
  }, []); // מריצים את useEffect פעם אחת בלבד

  useSocket("likeAdded", (updatedTrip) => {
    if (updatedTrip._id === trip._id) {
      setNumOfLikes(updatedTrip.numOfLikes);
    }
  });

  const toggleLike = async () => {
    try {
      await tripsService.addLike(trip._id!);
      const updatedTrip = await tripsService.getByTripId(trip._id!);
      send("addLike", updatedTrip);
      const userId = localStorage.getItem("loggedUserId");
      const liked =
        updatedTrip.likes?.some((like) => like.owner === userId) || false;

      setIsLiked(liked);
      if (updatedTrip.likes) {
        setNumOfLikes(updatedTrip.numOfLikes);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteTrip(trip._id!);
      } else {
        await addFavoriteTrip(trip._id!);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return {
    isLiked,
    numOfLikes,
    numOfComments,
    isFavorite,
    toggleLike,
    toggleFavorite,
  };
};

export default useTripCard;
