import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "../Header";
import HeroSection from "../Home/HeroSection";
import FeaturesSection from "../Home/FeaturesSection";
import Footer from "../Home/Footer";
import HowItWorksSection from "../Home/HowItWorks";
import "./style.css";

const HomePage = () => {
  const { t } = useTranslation(); // Hook לתרגום
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
        <section id="hero-section" className="main-page">
          <HeroSection />
        </section>
        <section id="features-section">
          <FeaturesSection />
        </section>
        <section id="how-it-works-section">
          <HowItWorksSection />
        </section>
        <section id="contact-section">
          <Footer />
        </section>
      </section>

      {showScrollToTop && (
        <div
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label={t("homePage.scrollToTop")}
        >
          <ArrowUp className="icon scroll-to-top-icon" />
        </div>
      )}
    </>
  );
};

export default HomePage;
