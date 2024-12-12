import apiClient from "./apiClient";
import { CredentialResponse } from "@react-oauth/google";
import { AxiosResponse } from "axios";
import socket from "../Hooks/socketInstance";
import { useTrips } from "../Context/TripContext";

export interface IUser {
  userName?: string;
  email?: string;
  password?: string;
  imgUrl?: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const loginUser = (user: IUser): Promise<IUser> => {
  const { refreshTrips } = useTrips();
  return new Promise<IUser>((resolve, reject) => {
    console.log("Login...");

    apiClient
      .post("/auth/login", user)
      .then((response: any) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("loggedUserId", response.data._id);
        localStorage.setItem("imgUrl", response.data.imgUrl);
        localStorage.setItem("userName", response.data.userName);
        refreshTrips();

        const token = response.data.accessToken;

        socket.auth = { token };

        if (!socket.connected) {
          socket.connect();
        }

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

    apiClient
      .post("/auth/register", user)
      .then((response) => {
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

        const token = response.data.accessToken;

        socket.auth = { token };

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
  const { refreshTrips } = useTrips();
  return new Promise<void>((resolve, reject) => {
    console.log("Logging out...");
    const refreshToken = localStorage.getItem("refreshToken");
    refreshTrips();
    localStorage.clear();

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
