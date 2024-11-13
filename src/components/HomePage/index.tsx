import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Header from "../Header";
import HeroSection from "../Home/HeroSection";
import FeaturesSection from "../Home/FeaturesSection";
import Footer from "../Home/Footer";
import HowItWorksSection from "../Home/HowItWorks";
import "./style.css";

const variants = {
  right: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: 100, transition: { duration: 1 } },
  },
  left: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: -100, transition: { duration: 1 } },
  },
};

const HomePage = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // מראה את הכפתור אם גוללים למטה מ-100 פיקסלים
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
          variants={variants.left}
        >
          <FeaturesSection />
        </motion.div>

        {/* HowItWorksSection נכנס מימין */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
          variants={variants.right}
        >
          <HowItWorksSection />
        </motion.div>

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
