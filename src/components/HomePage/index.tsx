import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";
import Header from "../Header";
import HeroSection from "../Home/HeroSection";

const HomePage = () => {
  return (
    <>
      <Header />
      <section className="main-page">
        <HeroSection />
      </section>
    </>
  );
};

export default HomePage;
