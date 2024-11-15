import { useEffect, useState } from "react";
import tripsService, { ITrips } from "../services/tripsService";
import useSocket from "./useSocket";
import { addFavoriteTrip, removeFavoriteTrip } from "../services/usersService";

const useTripCard = (trip: ITrips | null) => {
  // Initialize with default values if trip is null
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(trip?.numOfLikes || 0);
  const [numOfComments, setNumOfComments] = useState(trip?.numOfComments || 0);

  const { send } = useSocket();

  useEffect(() => {
    if (!trip) return; // Exit if trip is null

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
  }, [trip, trip?._id]);

  useSocket("likeAdded", (updatedTrip) => {
    if (updatedTrip._id === trip?._id) {
      setNumOfLikes(updatedTrip.numOfLikes);

      const userId = localStorage.getItem("loggedUserId");
      const liked =
        updatedTrip.likes?.some((like: any) => like.owner === userId) || false;
      setIsLiked(liked);
    }
  });

  // useSocket("commentAdded", async (updatedTrip) => {
  //   if (updatedTrip._id === trip?._id) {
  //     try {
  //       const refreshedTrip = await tripsService.getByTripId(trip?._id!);
  //       setNumOfComments(refreshedTrip.numOfComments);
  //     } catch (error) {
  //       console.error("Failed to fetch updated trip data:", error);
  //     }
  //   }
  // });

  const toggleLike = async () => {
    if (!trip) return; // Exit if trip is null

    try {
      await tripsService.addLike(trip._id!);
      const updatedTrip = await tripsService.getByTripId(trip._id!);
      send("addLike", updatedTrip);
      const userId = localStorage.getItem("loggedUserId");
      const liked =
        updatedTrip.likes?.some((like) => like.owner === userId) || false;

      setIsLiked(liked);
      setNumOfLikes(updatedTrip.numOfLikes);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!trip) return;

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
