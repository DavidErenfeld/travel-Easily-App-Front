import apiClient from "./apiClient";
import axios from "axios";
interface IUploadResponse {
  url: string;
}

const CLOUDINARY_CLOUD_NAME = "dstyeoecz";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const getOptimizedImageUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/q_auto,f_auto,w_600,h_400,c_limit/${publicId}`;
};

export const uploadPhoto = async (photo: File): Promise<string> => {
  try {
    const formData = new FormData();
    const newPhoto = new File([photo], photo.name);
    formData.append("file", newPhoto);
    formData.append("upload_preset", "sfrsket2");

    const res = await axios.post<IUploadResponse>(
      CLOUDINARY_UPLOAD_URL,
      formData
    );
    const publicId = res.data.url.split("/").pop()?.split(".")[0];
    if (!publicId) {
      throw new Error("Failed to extract publicId");
    }

    const optimizedUrl = getOptimizedImageUrl(publicId);
    return optimizedUrl;
  } catch (err) {
    console.error("Network error occurred during photo upload:", err);
    throw err;
  }
};

export const deletePhotoFromCloudinary = async (src: string): Promise<void> => {
  try {
    const publicId = src.split("/").pop()?.split(".")[0];
    if (!publicId) {
      throw new Error("Failed to extract publicId for deletion");
    }

    await apiClient.delete("file/delete-image", {
      data: { publicId },
    });

    console.log("Image deleted from Cloudinary successfully.");
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    throw error;
  }
};
