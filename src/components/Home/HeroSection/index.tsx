import React from "react";
import { Compass, Globe } from "lucide-react";
import "./style.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="description-container">
        <h1>The new way to travel</h1>
        <p>
          Travel Easily offers ad-free, inspiration-focused travel plans,
          letting you find itineraries and share your experiences simply and
          clearly.
        </p>
      </div>
      <div className="earth-container">
        <img
          src="/images/Earth.png"
          alt="Planet Earth"
          className="earth-image"
        />
      </div>

      <button className="btn-cta-exl">Start Exploring Itineraries</button>
    </section>
  );
};

export default HeroSection;
