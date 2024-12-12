import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import tripsService, { ITrips } from "../services/tripsService";

interface TripContextType {
  trips: ITrips[];
  setTrips: React.Dispatch<React.SetStateAction<ITrips[]>>;
  refreshTrips: () => Promise<void>;
  contextLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [contextLoading, setContextLoading] = useState(true);

  const refreshTrips = async () => {
    setContextLoading(true);
    try {
      const { req } = tripsService.getAllTrips();

      const response = await req;

      setTrips(response.data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setContextLoading(false);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, []);

  return (
    <TripContext.Provider
      value={{ trips, setTrips, refreshTrips, contextLoading }}
    >
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
