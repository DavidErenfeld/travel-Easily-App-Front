import React from "react";
import TripCard from "../../TripComponents/TripCard";
import "./style.css";
import trips from "../../../LocalData";

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">What Makes Us Unique?</h2>
      <p className="section-subtitle">
        Discover the authentic travel experiences our platform offers through
        detailed, user-driven itineraries.
      </p>

      <div className="feature-list">
        <div className="feature-item-1">
          <TripCard trip={trips[0]} />
        </div>
        <div className="feature-item-2">
          <h3>Personalized and Detailed Itineraries</h3>
          <p className="feature-description">
            Every itinerary on our platform is crafted from a traveler's unique
            perspective, emphasizing daily activities and key experiences. We
            encourage travelers to share insights and recommendations for each
            stop, allowing readers to fully immerse themselves in the journey.
          </p>
        </div>

        <div className="feature-item-3">
          <h3>Why This Matters?</h3>
          <p className="feature-description">
            Our platform is designed to deliver authentic, non-commercial travel
            content. These personal journey descriptions help build a community
            where users share genuine inspiration and explore destinations
            through the eyes of other travelers.
          </p>
        </div>
        <div className="feature-item-4">
          <TripCard trip={trips[1]} />
        </div>

        <div className="feature-item-5">
          <TripCard trip={trips[2]} />
        </div>
        <div className="feature-item-6">
          <h3>Favorite Trips & Easy Sharing</h3>
          <p className="feature-description">
            Easily save and share your favorite itineraries with a single click.
            This feature enables users to share unique trips with friends and
            family, helping others to plan memorable journeys full of insights.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
