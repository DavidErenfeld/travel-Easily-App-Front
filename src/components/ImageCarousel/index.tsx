import { useRef, useState } from "react";
import "./style.css";

interface Images {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: Images[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null); 

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

  return (
    <div className="carousel-container">
      <div className="carousel" ref={carouselRef}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="carousel-image"
          />
        ))}
      </div>
      <button className="scroll-button left" onClick={() => scroll("left")}>
        ‹
      </button>
      <button className="scroll-button right" onClick={() => scroll("right")}>
        ›
      </button>
    </div>
  );
};

export default ImageCarousel;
