// SocketListener.tsx
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTrips } from "../Context/TripContext";
import socket from "../Hooks/socketInstance";

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

    // מאזין לאירוע התנתקות משתמש
    const handleDisconnect = () => {
      console.log("Received disconnectUser event");
      logout();
    };

    if (!socket.hasListeners("disconnectUser")) {
      socket.on("disconnectUser", handleDisconnect);
    }

    // מאזין לאירועים של לייקים
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

    // מאזין לאירועים של מועדפים
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
      console.log("Received commentAdded event", { tripId, newComment });

      // אם newComment.userId לא תואם את המשתמש הנוכחי, הוסף את התגובה
      if (newComment.userId === user?._id) {
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
      }
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

    // רישום המאזינים
    socket.on("likeAdded", handleLikeAdded);
    socket.on("likeRemoved", handleLikeRemoved);
    socket.on("addFavorite", handleFavoriteAdded);
    socket.on("removeFavorite", handleFavoriteRemoved);
    socket.on("commentAdded", handleCommentAdded);
    socket.on("commentDeleted", handleCommentDeleted);

    return () => {
      console.log("SocketListener unmounted");
      // הסרת המאזינים
      socket.off("disconnectUser", handleDisconnect);
      socket.off("likeAdded", handleLikeAdded);
      socket.off("likeRemoved", handleLikeRemoved);
      socket.off("favoriteAdded", handleFavoriteAdded);
      socket.off("favoriteRemoved", handleFavoriteRemoved);
      socket.off("commentAdded", handleCommentAdded);
      socket.off("commentDeleted", handleCommentDeleted);
    };
  }, [logout, setTrips, user?._id]);

  return null;
}

export default SocketListener;
