import React from "react";
import "./style.css";

const FeaturesSection: React.FC = () => {
  return (
    <section className="features-section">
      <h2>מה מייחד אותנו?</h2>
      <div className="feature-list">
        <div className="feature-item">רשת חברתית לטיולים בלבד</div>
        <div className="feature-item">חיפוש מסלולים לפי אזור וסגנון</div>
        <div className="feature-item">שמירת מסלולים מועדפים ושיתוף קל</div>
        <div className="feature-item">שחזור סיסמה וגישה מאובטחת</div>
      </div>
    </section>
  );
};

export default FeaturesSection;
