import { useEffect, useState } from "react";
import tripsService, { ITrips } from "../services/tripsService";
import useSocket from "./useSocket";
import { addFavoriteTrip, removeFavoriteTrip } from "../services/usersService";

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
  }, [trip, trip._id]);

  useSocket("likeAdded", (updatedTrip) => {
    if (updatedTrip._id === trip._id) {
      setNumOfLikes(updatedTrip.numOfLikes);
    }
  });

  useSocket("commentAdded", (updatedTrip) => {
    if (updatedTrip._id === trip._id) {
      setNumOfComments(updatedTrip.numOfComments);
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
