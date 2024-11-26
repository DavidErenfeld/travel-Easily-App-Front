import socket from "../Hooks/socketInstance";
import apiClient, { CanceledError } from "./apiClient";

export { CanceledError };
export interface ITrips {
  _id?: string;
  userName?: string;
  owner?: {
    _id?: string;
    userName?: string;
    imgUrl?: string;
  };
  imgUrl?: string;
  typeTraveler: string;
  country: string;
  typeTrip: string;
  numOfDays?: number;
  tripDescription: string[];
  numOfComments: number;
  numOfLikes: number;
  tripPhotos?: string[];

  isLikedByCurrentUser?: boolean;
  isFavoritedByCurrentUser?: boolean;
  comments: IComment[];

  likes?: Array<{
    owner: string;
    _id?: string;
    date?: Date;
  }>;
}

export interface IUpdateTrips {
  _id?: string;
  owner?: string;
  typeTraveler?: string;
  country?: string;
  typeTrip?: string;
  numOfDays?: number;
  tripDescription?: string[];
}

export interface IComment {
  _id?: string;
  ownerId?: string;
  owner?: string;
  comment: string;
  date: string;
}

export interface Ilike {
  _id?: string;
  owner?: string;
}

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const getAllTrips = () => {
  const abortController = new AbortController();
  const token = localStorage.getItem("accessToken");

  const headers = token ? { Authorization: `jwt ${token}` } : {};

  const req = apiClient.get<ITrips[]>("trips", {
    signal: abortController.signal,
    headers,
  });

  console.log("getAllTrips");
  return { req, abort: () => abortController.abort() };
};

const getByOwnerId = (userId: string) => {
  return new Promise((resolve, reject) => {
    console.log("Get By Id...");
    apiClient
      .get(`/trips/owner/${userId}`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const getByTripId = (tripId: string) => {
  return new Promise<ITrips>((resolve, reject) => {
    console.log("Get By Id...");
    apiClient
      .get(`/trips/FullTrip/${tripId}`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
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

const postTrip = (trip: ITrips) => {
  return new Promise<ITrips>((resolve, reject) => {
    console.log("Post...");
    apiClient
      .post("/trips", trip, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const updateTrip = (trip: IUpdateTrips) => {
  return new Promise<ITrips>((resolve, reject) => {
    console.log("Update Trip...");
    apiClient
      .put(`/trips/${trip._id}`, trip, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const deleteTrip = (tripId: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Delete Trip...");
    apiClient
      .delete(`/trips/${tripId}`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const searchTripsByParams = (params: Record<string, string | number>) => {
  return new Promise<ITrips[]>((resolve, reject) => {
    console.log("Search trips by params");
    apiClient
      .get("/trips//search/parameters", {
        params,
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        console.log("Error searching trips:", error);
        reject(error);
      });
  });
};

const getFavoriteTrips = (userId: string) => {
  return new Promise<ITrips[]>((resolve, reject) => {
    console.log("Fetching favorite trips...");
    apiClient
      .get(`/trips/favorites/${userId}`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching favorite trips:", error);
        reject(error);
      });
  });
};

const getFavoriteTripIds = (userId: string) => {
  return new Promise<string[]>((resolve, reject) => {
    console.log("Fetching favorite trip IDs...");
    apiClient
      .get(`/users/${userId}/favorites`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching favorite trip IDs:", error);
        reject(error);
      });
  });
};

const addComment = (tripId: string, comment: IComment) => {
  return new Promise<IComment>((resolve, reject) => {
    console.log("Add Comment...");
    apiClient
      .post(
        `/trips/${tripId}/comments`,
        { comment },
        {
          headers: {
            Authorization: `jwt ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const deleteComment = (tripId: string, commentId: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Delete Comment...");
    apiClient
      .delete(`/trips/${tripId}/${commentId}`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        socket.emit("deleteComment", { tripId, commentId });
        resolve();
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const addLike = (tripId: string) => {
  return new Promise<ITrips>((resolve, reject) => {
    console.log("addLick...");
    apiClient
      .post(
        `/trips/${tripId}/likes`,
        { owner: "david" },
        {
          headers: {
            Authorization: `jwt ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const getLikesDetails = (tripId: string) => {
  return new Promise<{
    totalLikes: number;
    likesDetails: Array<{ userName: string; imgUrl: string }>;
  }>((resolve, reject) => {
    console.log("Fetching likes details for trip...");
    apiClient
      .get(`/trips/${tripId}/likes/details`, {
        headers: {
          Authorization: `jwt ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log("Likes details");
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error fetching likes details:", error);
        reject(error);
      });
  });
};

export default {
  getAllTrips,
  getByOwnerId,
  getByTripId,
  getFavoriteTripIds,
  postTrip,
  updateTrip,
  searchTripsByParams,
  addLike,
  deleteTrip,
  getFavoriteTrips,
  addComment,
  deleteComment,
  getLikesDetails,
};
