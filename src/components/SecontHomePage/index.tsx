import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUp } from "lucide-react";
import Header from "../Header";
import Footer from "../Home/Footer";
import "./style.css";
import MenuBar from "../Menus/MenuBar";
import { useNavigate } from "react-router-dom";

const SecontHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const searchByCountry = (country: string) => {
    navigate(`/trips/${country}`);
  };

  const destinations = [
    {
      name: "Dubai",
      displayName: t("secontHomePage.destinations.dubai.name"),
      image: "/images/citys/Dubai.jpg",
      description: t("secontHomePage.destinations.dubai.description"),
    },
    {
      name: "Greece",
      displayName: t("secontHomePage.destinations.greece.name"),
      image: "/images/citys/Greece.jpg",
      description: t("secontHomePage.destinations.greece.description"),
    },
    {
      name: "Hungary",
      displayName: t("secontHomePage.destinations.hungary.name"),
      image: "/images/citys/Hungarian.jpg",
      description: t("secontHomePage.destinations.hungary.description"),
    },
    {
      name: "Bulgaria",
      displayName: t("secontHomePage.destinations.bulgaria.name"),
      image: "/images/citys/Bulgaria.jpg",
      description: t("secontHomePage.destinations.bulgaria.description"),
    },
    {
      name: "Netherlands",
      displayName: t("secontHomePage.destinations.netherlands.name"),
      image: "/images/citys/Netherlands.jpg",
      description: t("secontHomePage.destinations.netherlands.description"),
    },
    {
      name: "Montenegro",
      displayName: t("secontHomePage.destinations.montenegro.name"),
      image: "/images/citys/Montenegro.jpg",
      description: t("secontHomePage.destinations.montenegro.description"),
    },
  ];

  return (
    <>
      <Header />
      <MenuBar />

      <section className="destinations-grid">
        <h1>{t("secontHomePage.title")}</h1>
        {destinations.map((destination) => (
          <div key={destination.name} className="destination-card">
            <img src={destination.image} alt={destination.displayName} />
            <h3>{destination.displayName}</h3>
            <p>{destination.description}</p>
            <button
              className="btn-cta-m"
              onClick={() => searchByCountry(destination.name)}
            >
              {t("secontHomePage.exploreButton")}
            </button>
          </div>
        ))}
        <button
          className="main-search-btn btn-cta-exl"
          onClick={() => navigate("/searchTrip")}
        >
          {t("secontHomePage.exploreAllButton")}
        </button>
      </section>
      <Footer />
      {showScrollToTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <ArrowUp className="icon scroll-to-top-icon" />
        </div>
      )}
    </>
  );
};

export default SecontHomePage;
