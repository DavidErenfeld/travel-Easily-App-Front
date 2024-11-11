import React from "react";
import "./style.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© Travel Easily, 2024</p>
      <div className="footer-links">
        <a href="#about">אודות</a> | <a href="#contact">צור קשר</a> |{" "}
        <a href="#privacy">פרטיות</a>
      </div>
    </footer>
  );
};

export default Footer;
