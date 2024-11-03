import { useEffect, useState } from "react";
import tripsService, { ITrips } from "../services/tripsService";
import useSocket from "./useSocket";

const useTripCard = (trip: ITrips) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(trip.numOfLikes);
  const [numOfComments, setNumOfComments] = useState(trip.numOfComments);

  const { send } = useSocket();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const userId = localStorage.getItem("loggedUserId"); // אם יש צורך ב-ID המשתמש, נשקול לשמור אותו ב-Context או Redux store

      try {
        const updatedTrip = await tripsService.getByTripId(trip._id!);
        const liked =
          updatedTrip.likes?.some((like) => like.owner === userId) || false;

        setIsLiked(liked);
        if (updatedTrip.likes) {
          setNumOfLikes(updatedTrip.numOfLikes);
        }
        setNumOfComments(updatedTrip.numOfComments);
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };

    fetchLikeStatus();
  }, [trip]);

  // האזנה לאירועים דרך הסוקט עבור לייקים ותגובות
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
      const userId = localStorage.getItem("loggedUserId"); // גם כאן נשקול לאחסן את ה-ID במקום מרכזי יותר
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

  return { isLiked, numOfLikes, numOfComments, toggleLike };
};

export default useTripCard;
