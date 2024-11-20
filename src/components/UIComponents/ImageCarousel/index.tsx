import { useRef, useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import LoadingDots from "../../UIComponents/Loader";
import PopUp from "../PopUp";
import "./style.css";

export interface Images {
  src: string;
  alt: string;
  isFromServer?: boolean;
}

interface ImageCarouselProps {
  images: Images[];
  deleteImage?: (image: Images) => void;
  showDeleteButton?: boolean;
}

const ImageCarousel = ({
  images,
  deleteImage,
  showDeleteButton,
}: ImageCarouselProps) => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [imageToDelete, setImageToDelete] = useState<Images>();
  const [loading, setLoading] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const imageLoadPromises = images.map(
        (image) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => resolve();
          })
      );
      await Promise.all(imageLoadPromises);
      setLoading(false);
    };

    loadImages();
  }, [images]);

  const emptyImage = {
    src: "",
    alt: "",
    isFromServer: false,
  };

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <LoadingDots />
        </div>
      ) : (
        <div className="carousel-container">
          <div className="carousel" ref={carouselRef}>
            {images.map((image) => (
              <div
                className="img-container"
                key={image.src}
                onClick={() => console.log(image)}
              >
                <img
                  src={image.src}
                  alt={t(image.alt)}
                  className="carousel-image"
                />
                {showDeleteButton && deleteImage && (
                  <MdDelete
                    onClick={() => {
                      setImageToDelete(image);
                    }}
                    className="delete-icon"
                  />
                )}
              </div>
            ))}
          </div>
          <button className="scroll-button left" onClick={() => scroll("left")}>
            ‹
          </button>
          <button
            className="scroll-button right"
            onClick={() => scroll("right")}
          >
            ›
          </button>
        </div>
      )}

      {imageToDelete && (
        <div className="popup-overlay">
          <PopUp
            message={t("imageCarousel.confirmDelete")}
            handleDeleteBtn={() => {
              if (deleteImage) {
                deleteImage(imageToDelete);
              }
              setImageToDelete(undefined);
            }}
            handleCancelBtn={() => setImageToDelete(undefined)}
          />
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
