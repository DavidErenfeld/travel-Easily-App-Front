import apiClient from "./apiClient";

export interface IUpdateUser {
  userName?: string;
  email?: string;
  password?: string;
  imgUrl?: string;
}

export const updateUser = (userId: string, user: IUpdateUser) => {
  const accessToken = localStorage.getItem("token");

  return new Promise<IUpdateUser>((resolve, reject) => {
    console.log("Update user...");
    apiClient
      .put(
        `/users/${userId}`,
        {
          imgUrl: user.imgUrl,
        },
        {
          headers: {
            Authorization: `jwt ${accessToken}`,
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
