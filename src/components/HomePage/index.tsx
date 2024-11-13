import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";
import Header from "../Header";
import HeroSection from "../Home/HeroSection";
import FeaturesSection from "../Home/FeaturesSection";
import Footer from "../Home/Footer";
import HowItWorksSection from "../Home/HowItWorks";

const HomePage = () => {
  return (
    <>
      <Header />
      <section className="main-page">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <Footer />
      </section>
    </>
  );
};

export default HomePage;
