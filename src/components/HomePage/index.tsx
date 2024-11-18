import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Header from "../Header";
import HeroSection from "../Home/HeroSection";
import FeaturesSection from "../Home/FeaturesSection";
import Footer from "../Home/Footer";
import HowItWorksSection from "../Home/HowItWorks";
import "./style.css";

const HomePage = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <section className="main-page">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <Footer />
      </section>

      {showScrollToTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <ArrowUp className="icon scroll-to-top-icon" />
        </div>
      )}
    </>
  );
};

export default HomePage;
