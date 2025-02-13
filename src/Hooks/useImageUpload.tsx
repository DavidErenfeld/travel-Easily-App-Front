import { useState, useRef, useEffect } from "react";
import {
  uploadPhoto,
  deletePhotoFromCloudinary,
} from "../services/fileService";

interface ImageWithFile {
  file?: File;
  src: string;
  alt: string;
  isFromServer?: boolean;
}

interface Image {
  src: string;
  alt: string;
  isFromServer?: boolean;
}

const useImageUpload = (initialImages: ImageWithFile[] = []) => {
  const [images, setImages] = useState<ImageWithFile[]>(initialImages);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (!image.isFromServer) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => ({
        file,
        src: URL.createObjectURL(file),
        alt: file.name || "Trip Image",
        isFromServer: false,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const deleteImage = async (imageData: Image) => {
    if (imageData.isFromServer) {
      try {
        await deletePhotoFromCloudinary(imageData.src);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
      }
    }

    setImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (image) => image.src !== imageData.src
      );
      return updatedImages;
    });
  };

  const uploadImages = async () => {
    const newImages = images.filter((image) => !image.isFromServer);
    const urls: string[] = [];
    for (const image of newImages) {
      if (image.file) {
        try {
          const uploadedUrl = await handleUploadImage(image.file);
          uploadedUrl && urls.push(uploadedUrl);
        } catch (error) {
          console.error("Upload failed:", error);
          alert("Failed to upload images.");
        }
      }
    }
    return urls;
  };

  const handleUploadImage = async (imgFile: File) => {
    try {
      const uploadedUrl = await uploadPhoto(imgFile);
      return uploadedUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
      return null;
    }
  };

  const openImageSelector = () => {
    imageInputRef.current?.click();
  };

  return {
    images,
    imageInputRef,
    handleImageChange,
    deleteImage,
    uploadImages,
    openImageSelector,
    handleUploadImage,
  };
};

export default useImageUpload;
