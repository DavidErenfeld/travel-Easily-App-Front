import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTrips } from "../Context/TripContext";
import socket from "../Hooks/socketInstance";
import { ITrips } from "../services/tripsService";

interface LikeEventData {
  tripId: string;
  userId: string;
}

interface FavoriteEventData {
  tripId: string;
  userId: string;
}

interface CommentEventData {
  tripId: string;
  newComment: any;
}

interface CommentDeletedEventData {
  tripId: string;
  commentId: string;
}

function SocketListener() {
  const { logout, user } = useAuth();
  const { setTrips } = useTrips();

  useEffect(() => {
    console.log("SocketListener mounted");
    const handleDisconnectUser = () => {
      console.log("Received disconnectUser event");
      logout(); // נתק את המשתמש במקרה של בקשה מהשרת
    };

    const handleDisconnect = (reason: string) => {
      console.warn(`Socket disconnected: ${reason}`);
      if (reason === "io server disconnect") {
        // אם השרת ניתק, נסה להתחבר מחדש
        console.log("Reconnecting after server disconnect...");
        socket.connect();
      } else {
        console.log("Disconnected due to other reason, notifying user...");
        // כאן ניתן להוסיף הודעה למשתמש אם החיבור אבד
      }
    };

    const handleTripPosted = (newTrip: ITrips) => {
      setTrips((prevTrips) =>
        prevTrips.some((trip) => trip._id === newTrip._id)
          ? prevTrips
          : [...prevTrips, newTrip]
      );
    };

    const handleTripDeleted = ({ tripId }: { tripId: string }) => {
      console.log(`Trip deleted`);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
    };

    const handleLikeAdded = ({ tripId, userId }: LikeEventData) => {
      console.log("handleLikeAdded");
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId
            ? {
                ...trip,
                numOfLikes: trip.numOfLikes + 1,
                isLikedByCurrentUser:
                  userId === user?._id ? true : trip.isLikedByCurrentUser,
              }
            : trip
        )
      );
    };

    const handleLikeRemoved = ({ tripId, userId }: LikeEventData) => {
      console.log("handleLikeRemoved");
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId
            ? {
                ...trip,
                numOfLikes: trip.numOfLikes - 1,
                isLikedByCurrentUser:
                  userId === user?._id ? false : trip.isLikedByCurrentUser,
              }
            : trip
        )
      );
    };

    const handleFavoriteAdded = ({ tripId, userId }: FavoriteEventData) => {
      console.log("handleFavoriteAdded");
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId
            ? {
                ...trip,
                isFavoritedByCurrentUser:
                  userId === user?._id ? true : trip.isFavoritedByCurrentUser,
              }
            : trip
        )
      );
    };

    const handleFavoriteRemoved = ({ tripId, userId }: FavoriteEventData) => {
      console.log("handleFavoriteRemoved");
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId
            ? {
                ...trip,
                isFavoritedByCurrentUser:
                  userId === user?._id ? false : trip.isFavoritedByCurrentUser,
              }
            : trip
        )
      );
    };

    const handleCommentAdded = ({ tripId, newComment }: CommentEventData) => {
      console.log("Received commentAdded event");

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId
            ? {
                ...trip,
                comments: [...trip.comments, newComment],
                numOfComments: trip.numOfComments + 1,
              }
            : trip
        )
      );
    };

    const handleCommentDeleted = ({
      tripId,
      commentId,
    }: CommentDeletedEventData) => {
      console.log("handleCommentDeleted");
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId
            ? {
                ...trip,
                comments: trip.comments.filter((c) => c._id !== commentId),
                numOfComments: trip.numOfComments - 1,
              }
            : trip
        )
      );
    };

    const handleUserDeleted = ({
      userId,
      deletedTripIds,
      deletedCommentIds,
      deletedLikeIds,
    }: {
      userId: string;
      deletedTripIds: string[];
      deletedCommentIds: string[];
      deletedLikeIds: string[];
    }) => {
      console.log("Received userDeleted event", {
        userId,
        deletedTripIds,
        deletedCommentIds,
        deletedLikeIds,
      });

      setTrips((prevTrips) =>
        prevTrips
          .filter((trip) => !deletedTripIds.includes(trip._id || ""))
          .map((trip) => ({
            ...trip,
            comments:
              trip.comments?.filter(
                (comment) => !deletedCommentIds.includes(comment._id || "")
              ) || [],
            numOfComments:
              trip.comments?.filter(
                (comment) => !deletedCommentIds.includes(comment._id || "")
              ).length || 0,
            likes:
              trip.likes?.filter(
                (like) => !deletedLikeIds.includes(like._id || "")
              ) || [],
            numOfLikes:
              trip.likes?.filter(
                (like) => !deletedLikeIds.includes(like._id || "")
              ).length || 0,
          }))
      );
    };

    socket.on("disconnect", handleDisconnect);
    socket.on("tripPosted", handleTripPosted);
    socket.on("tripDeleted", handleTripDeleted);
    socket.on("likeAdded", handleLikeAdded);
    socket.on("likeRemoved", handleLikeRemoved);
    socket.on("addFavorite", handleFavoriteAdded);
    socket.on("removeFavorite", handleFavoriteRemoved);
    socket.on("commentAdded", handleCommentAdded);
    socket.on("commentDeleted", handleCommentDeleted);
    socket.on("userDeleted", handleUserDeleted);

    return () => {
      console.log("SocketListener unmounted");
      socket.off("disconnectUser", handleDisconnectUser);
      socket.off("disconnect", handleDisconnect);
      socket.off("tripDeleted", handleTripDeleted);
      socket.off("tripPosted", handleTripPosted);
      socket.off("likeAdded", handleLikeAdded);
      socket.off("likeRemoved", handleLikeRemoved);
      socket.off("favoriteAdded", handleFavoriteAdded);
      socket.off("favoriteRemoved", handleFavoriteRemoved);
      socket.off("commentAdded", handleCommentAdded);
      socket.off("commentDeleted", handleCommentDeleted);
      socket.off("userDeleted", handleUserDeleted);
    };
  }, [logout, setTrips, user?._id]);

  return null;
}

export default SocketListener;
