import useSocket from "../Hooks/useSocket";
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

export const requestPasswordReset = (email: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Requesting password reset...");

    apiClient
      .post("/users/request-password-reset", { email })
      .then(() => {
        console.log("Password reset link sent successfully.");
        resolve();
      })
      .catch((error) => {
        console.error("Error sending password reset link:", error);
        reject(error);
      });
  });
};

export const resetPassword = (token: string, newPassword: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Resetting password...");

    apiClient
      .post("/users/reset-password", { token, newPassword })
      .then(() => {
        console.log("Password reset successfully.");
        resolve();
      })
      .catch((error) => {
        console.error("Error resetting password:", error);
        reject(error);
      });
  });
};

export const deleteUser = (userId: string) => {
  const { socket } = useSocket();

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

      // שידור אירוע userDeleted לאחר מחיקה מוצלחת
      socket.emit("userDeleted", userId);

      // ניקוי ה־localStorage
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
