import apiClient from "./apiClient";

export interface IUpdateUser {
  userName?: string;
  email?: string;
  password?: string;
  imgUrl?: string;
}

// פונקציה להוספת טיול למועדפים
export const addFavoriteTrip = (tripId: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Adding trip to favorites...");

    apiClient
      .post(
        `/users/favorites/${tripId}`,
        {},
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        console.log("Trip added to favorites successfully.");
        resolve();
      })
      .catch((error) => {
        console.error("Error adding trip to favorites:", error);
        reject(error);
      });
  });
};

// פונקציה להסרת טיול מהמועדפים
export const removeFavoriteTrip = (tripId: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Removing trip from favorites...");

    apiClient
      .delete(`/users/favorites/${tripId}`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(() => {
        console.log("Trip removed from favorites successfully.");
        resolve();
      })
      .catch((error) => {
        console.error("Error removing trip from favorites:", error);
        reject(error);
      });
  });
};

// פונקציה לעדכון משתמש
export const updateUser = (userId: string, user: IUpdateUser) => {
  return new Promise<IUpdateUser>((resolve, reject) => {
    console.log("Update user....");
    apiClient
      .put(
        `/users/${userId}`,
        {
          imgUrl: user.imgUrl,
        },
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

// פונקציה למחיקת משתמש
export const deleteUser = (userId: string) => {
  return new Promise<void>(async (resolve, reject) => {
    console.log("Delete User...");

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return reject("No access token available.");
    }

    try {
      // בקשת מחיקה לשרת
      await apiClient.delete(`/users/${userId}`, {
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      });

      console.log("User deleted successfully");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loggedUserId");
      localStorage.removeItem("imgUrl");
      localStorage.removeItem("userName");
      resolve();
    } catch (error: any) {
      console.error(
        "Error deleting user:",
        error?.response?.data || error.message || error
      );
      reject(error);
    }
  });
};
