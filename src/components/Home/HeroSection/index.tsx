import { useNavigate } from "react-router-dom";
import "./style.css";

const HeroSection = () => {
  const navigate = useNavigate();
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
          src="/images/Earth.webp"
          alt="Planet Earth"
          className="earth-image"
        />
      </div>

      <button onClick={() => navigate("/searchTrip")} className="btn-cta-exl">
        Start Exploring Itineraries
      </button>
    </section>
  );
};

export default HeroSection;
