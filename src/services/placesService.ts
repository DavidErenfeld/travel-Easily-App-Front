import apiClient from "./apiClient";

export interface SearchParams {
  location: string;
  radius: number;
  type: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  phone?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
}

/**
 *
 * @param location
 * @param radius
 * @param type
 * @returns
 */
const getPlaces = (
  location: string,
  radius: number,
  type: string
): Promise<Place[]> => {
  console.log("Fetching places from server...");

  return new Promise<Place[]>((resolve, reject) => {
    apiClient
      .get("api/places", {
        params: {
          location,
          radius,
          type,
        },
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log("Places fetched successfully");
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
        reject(error);
      });
  });
};

export const fetchPlaces = async ({
  location,
  radius,
  type,
}: SearchParams): Promise<Place[]> => {
  try {
    const places = await getPlaces(location, radius * 1000, type);
    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
};

export { getPlaces };
