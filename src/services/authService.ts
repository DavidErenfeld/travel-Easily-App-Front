// authService.ts

import apiClient from "./apiClient";
import { CredentialResponse } from "@react-oauth/google";
import { AxiosResponse } from "axios";
import socket from "../Hooks/socketInstance";

export interface IUser {
  userName?: string;
  email?: string; // הפכנו לאופציונלי
  password?: string;
  imgUrl?: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const loginUser = (user: IUser): Promise<IUser> => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("Login...");

    apiClient
      .post("/auth/login", user)
      .then((response: any) => {
        // שמירת הטוקנים ומידע המשתמש ב-localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("loggedUserId", response.data._id);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        localStorage.setItem("userName", response.data.userName);
        console.log("accessToken = " + localStorage.getItem("accessToken"));
        console.log("refreshToken = " + localStorage.getItem("refreshToken"));

        // עדכון הטוקן ב-socket והתחברות
        const token = response.data.accessToken;

        // הגדרת הטוקן ב-socket.auth
        socket.auth = { token };

        // התחברות ל-socket אם לא מחובר
        if (!socket.connected) {
          socket.connect();
        }

        resolve(response.data); // מחזיר את נתוני המשתמש
      })
      .catch((error: any) => {
        console.log(error);
        reject(error);
      });
  });
};
export const registerUser = (user: IUser): Promise<IUser> => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("Registering...");
    console.log(user);

    apiClient
      .post("/auth/register", user)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const googleSignin = (
  credentialResponse: CredentialResponse
): Promise<IUser> => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("googleSignin...");
    apiClient
      .post("/auth/google", credentialResponse)
      .then((response: AxiosResponse) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("loggedUserId", response.data._id);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        localStorage.setItem("userName", response.data.userName);
        console.log(response);

        // עדכון הטוקן ב-socket והתחברות
        const token = response.data.accessToken;

        // הגדרת הטוקן ב-socket.auth
        socket.auth = { token };

        // התחברות ל-socket אם לא מחובר
        if (!socket.connected) {
          socket.connect();
        }

        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const logout = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    console.log("Logging out...");
    const refreshToken = localStorage.getItem("refreshToken");

    localStorage.clear();

    // נתק את ה-socket אם הוא מחובר
    if (socket.connected) {
      socket.disconnect();
    }
    if (!refreshToken) {
      console.log("No refresh token found.");
      reject(new Error("No refresh token available. Login required."));
      return;
    }

    apiClient
      .post(
        `/auth/logout`,
        {},
        {
          headers: {
            Authorization: `JWT ${refreshToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const authService = {
  loginUser,
  registerUser,
  googleSignin,
  logout,
};

export default authService;
