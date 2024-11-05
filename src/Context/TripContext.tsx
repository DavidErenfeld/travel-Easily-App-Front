import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import io from "socket.io-client";
import tripsService, { ITrips } from "../services/tripsService";

interface TripContextType {
  trips: ITrips[];
  setTrips: React.Dispatch<React.SetStateAction<ITrips[]>>;
  refreshTrips: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// יצירת חיבור Socket.IO
const token = localStorage.getItem("accessToken");
const socket = io("https://evening-bayou-77034-176dc93fb1e1.herokuapp.com", {
  transports: ["websocket"],
  auth: {
    token, 
  },
});


export const TripProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<ITrips[]>([]);

  useEffect(() => {
    // האזנה לאירועים של טיולים חדשים מהשרת
    socket.on("tripPosted", (newTrip: ITrips) => {
      setTrips((prevTrips) => [...prevTrips, newTrip]);
    });

    // האזנה לאירוע likeRemoved כדי לעדכן את מספר הלייקים בטיול ספציפי
    socket.on("likeRemoved", (updatedTrip) => {
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === updatedTrip.tripId
            ? { ...trip, numOfLikes: updatedTrip.numOfLikes }
            : trip
        )
      );
    });

    // האזנה לאירוע likeAdded כדי לעדכן את מספר הלייקים בטיול ספציפי
    socket.on("likeAdded", (updatedTrip) => {
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === updatedTrip.tripId
            ? { ...trip, numOfLikes: updatedTrip.numOfLikes }
            : trip
        )
      );
    });

    return () => {
      // ניקוי כל ההאזנות בעת פריקת הקומפוננטה
      socket.off("tripPosted");
      socket.off("likeRemoved");
      socket.off("likeAdded");
    };
  }, []);

  const refreshTrips = async () => {
    try {
      const { req } = tripsService.getAllTrips();
      const response = await req;
      setTrips(response.data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, []);

  return (
    <TripContext.Provider value={{ trips, setTrips, refreshTrips }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
};
