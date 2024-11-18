import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Header from "../Header";
import Footer from "../Home/Footer";
import "./style.css";
import MenuBar from "../Menus/MenuBar";
import TripCard from "../TripComponents/TripCard";
import LoadingDots from "../UIComponents/Loader";
import { ITrips } from "../../services/tripsService";
import { useTrips } from "../../Context/TripContext";
import { useNavigate } from "react-router-dom";
import Trips from "../TripComponents/Trips";
import TripsList from "../TripComponents/Trips";

const SecontHomePage = () => {
  const navigate = useNavigate();

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showTrips, setShowTrips] = useState(false);

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

  return (
    <>
      <Header />
      <MenuBar />

      <section className="destinations-grid">
        <h1>Explore Popular Destinations</h1>
        <div className="destination-card">
          <img src="/images/citys/Dubai.jpg" alt="Dubai" />
          <h3>Dubai</h3>
          <p>The perfect luxury getaway.</p>
          <button
            className="btn-cta-m"
            onClick={() => searchByCountry("Dubai")}
          >
            Explore
          </button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Greece.jpg" alt="Greece" />
          <h3>Greece</h3>
          <p>Discover ancient ruins and stunning islands.</p>
          <button
            className="btn-cta-m"
            onClick={() => searchByCountry("Greece")}
          >
            Explore
          </button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Hungarian.jpg" alt="Hungary" />
          <h3>Hungary</h3>
          <p>Experience the charm of Budapest.</p>
          <button
            className="btn-cta-m"
            onClick={() => searchByCountry("Hungary")}
          >
            Explore
          </button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Bulgaria.jpg" alt="Bulgaria" />
          <h3>Bulgaria</h3>
          <p>Explore Rila Monastery and scenic mountain views.</p>
          <button
            className="btn-cta-m"
            onClick={() => searchByCountry("Bulgaria")}
          >
            Explore
          </button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Netherlands.jpg" alt="Netherlands" />
          <h3>Netherlands</h3>
          <p>Stroll through tulip fields and iconic windmills.</p>
          <button
            className="btn-cta-m"
            onClick={() => searchByCountry("Netherlands")}
          >
            Explore
          </button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Montenegro.jpg" alt="Montenegro" />
          <h3>Montenegro</h3>
          <p>Discover the stunning Bay of Kotor.</p>
          <button
            className="btn-cta-m"
            onClick={() => searchByCountry("Montenegro")}
          >
            Explore
          </button>
        </div>
        <button
          className="main-search-btn btn-cta-exl"
          onClick={() => navigate("/searchTrip")}
        >
          Explore All Countries
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
