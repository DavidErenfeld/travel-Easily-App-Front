import React from "react";
import Header from "../../Header";
import HeroSection from "../HeroSection";
import FeaturesSection from "../FeaturesSection";
import Footer from "../Footer";
import "./style.css";

const HomeLine: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default HomeLine;
