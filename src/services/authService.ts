// authService.ts
import { socket } from "../Hooks/useSocket";
import apiClient from "./apiClient";
import { CredentialResponse } from "@react-oauth/google";
import { AxiosResponse } from "axios";

export interface IUser {
  userName?: string;
  email: string;
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
        // Store tokens and user info in localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("loggedUserId", response.data._id);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        localStorage.setItem("userName", response.data.userName);
        console.log("accessToken = " + localStorage.getItem("accessToken"));
        console.log("refreshToken = " + localStorage.getItem("refreshToken"));

        // Update token in socket and reconnect
        const token = response.data.accessToken;
        socket.auth.token = token;
        socket.connect();

        // Emit join event
        const userId = response.data._id;
        socket.emit("join", { userId });
        console.log(`Socket emitted join event with userId: ${userId}`);

        resolve(response.data);
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

        // Update token in socket and reconnect
        const token = response.data.accessToken;
        socket.auth.token = token;
        socket.connect();

        // Emit join event
        const userId = response.data._id;
        socket.emit("join", { userId });
        console.log(`Socket emitted join event with userId: ${userId}`);

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

    if (!refreshToken) {
      console.log("No refresh token found.");
      localStorage.clear();
      socket.disconnect(); // Disconnect the socket
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
        localStorage.clear();
        socket.disconnect(); // Disconnect the socket
        resolve();
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        socket.disconnect(); // Disconnect the socket
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
