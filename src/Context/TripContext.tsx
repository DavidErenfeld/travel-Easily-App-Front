import React, { createContext, useContext, useState, ReactNode } from "react";
import tripsService, { ITrips } from "../services/tripsService";

interface TripsResponse {
  data: ITrips[];
  total: number;
  page: number;
  limit: number;
}

interface TripContextType {
  trips: ITrips[];
  setTrips: React.Dispatch<React.SetStateAction<ITrips[]>>;
  loadTrips: (page: number, limit: number) => Promise<void>;
  refreshTrips: () => Promise<void>;
  contextLoading: boolean;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  resetTrips: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [trips, setTrips] = useState<ITrips[]>([]);
  const [contextLoading, setContextLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const resetTrips = () => {
    setTrips([]);
    setHasMore(true);
  };

  const loadTrips = async (page: number, limit: number) => {
    setContextLoading(true);
    try {
      const { req } = tripsService.getAllTrips(page, limit);
      const response = await req;
      const result: TripsResponse = response.data;
      setTrips((prevTrips) => [...prevTrips, ...result.data]);
      if (page * limit >= result.total) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setContextLoading(false);
    }
  };

  const refreshTrips = async () => {
    resetTrips();
    await loadTrips(1, 10);
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        setTrips,
        loadTrips,
        refreshTrips,
        contextLoading,
        hasMore,
        setHasMore,
        resetTrips,
      }}
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
