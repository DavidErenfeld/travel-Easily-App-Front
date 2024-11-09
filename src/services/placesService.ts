// placesService.ts

import apiClient from "./apiClient"; // ייבוא ה-client שהוגדר

// הגדרת הטיפוס של הפרמטרים
export interface SearchParams {
  location: string;
  radius: number;
  type: string;
}

// הגדרת הטיפוס למבנה הנתונים של המקום
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
 * פונקציה שמחזירה את המיקומים מהשרת לפי מיקום, רדיוס וסוג
 * @param location - מיקום בפורמט 'latitude,longitude'
 * @param radius - רדיוס החיפוש במטרים
 * @param type - סוג המקום לחיפוש
 * @returns Promise עם רשימת המיקומים
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
        console.log("Places fetched successfully:", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
        reject(error);
      });
  });
};

// פונקציה שמכילה את הלוגיקה עבור קריאת המיקומים
export const fetchPlaces = async ({
  location,
  radius,
  type,
}: SearchParams): Promise<Place[]> => {
  try {
    const places = await getPlaces(location, radius * 1000, type); // המרה למטרים
    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
};

export { getPlaces };
