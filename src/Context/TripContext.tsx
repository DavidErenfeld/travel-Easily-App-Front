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
const socket = io("https://evening-bayou-77034-176dc93fb1e1.herokuapp.com/");

export const TripProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<ITrips[]>([]);

  useEffect(() => {
    // האזנה לאירועים של טיולים חדשים מהשרת
    socket.on("tripPosted", (newTrip: ITrips) => {
      setTrips((prevTrips) => [...prevTrips, newTrip]);
    });

    return () => {
      // ניקוי ההאזנה בעת פריקת הקומפוננטה
      socket.off("tripPosted");
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
