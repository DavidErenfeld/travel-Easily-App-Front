import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import tripsService, { ITrips } from "../services/tripsService";
import socket from "../Hooks/socketInstance";

interface TripContextType {
  trips: ITrips[];
  setTrips: React.Dispatch<React.SetStateAction<ITrips[]>>;
  refreshTrips: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<ITrips[]>([]);

  useEffect(() => {
    // האזנה לאירועים של טיולים חדשים מהשרת
    socket.on("tripPosted", (newTrip: ITrips) => {
      setTrips((prevTrips) =>
        prevTrips.some((trip) => trip._id === newTrip._id)
          ? prevTrips
          : [...prevTrips, newTrip]
      );
    });

    return () => {
      // ניקוי כל ההאזנות בעת פריקת הקומפוננטה
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
    // טעינת הנתונים הראשונית
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
