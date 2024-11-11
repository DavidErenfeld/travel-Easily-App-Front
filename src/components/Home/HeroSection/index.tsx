import React from "react";
import "./style.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <h1>מקום להשראה לטיולים – נטול פרסומות וממוקד חוויות</h1>
      <p>
        Travel Easily נבנה כדי לספק חוויות טיול נטולות פרסומות וממוקדות השראה,
        כך שתוכלו למצוא מסלולים מוכנים ולשתף את החוויות שלכם בצורה נקייה ופשוטה.
      </p>
      <button className="explore-button">התחל לחקור מסלולים</button>
    </section>
  );
};

export default HeroSection;
