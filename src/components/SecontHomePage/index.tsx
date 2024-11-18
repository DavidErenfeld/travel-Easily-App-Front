import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Header from "../Header";
import Footer from "../Home/Footer";
import "./style.css";
import AdvancedSearch from "../AdvancedSearch";

const SecontHomePage = () => {
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
      <section className="menu-bar">
        <div className="menu-sub-item">All Trips</div>
        <div className="menu-sub-item">My Trips</div>
        <div className="menu-sub-item">Favorite Trips</div>
        <div className="menu-sub-item">Add Trip</div>
        <div className="menu-sub-item">Explore Nearby</div>
      </section>
      <section className="destinations-grid">
        <h1>Explore Popular Destinations</h1>
        <div className="destination-card">
          <img src="/images/citys/Dubai.jpg" alt="Dubai" />
          <h3>Dubai</h3>
          <p>The perfect luxury getaway.</p>
          <button className="btn-cta-m">Explore</button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Greece.jpg" alt="Greece" />
          <h3>Greece</h3>
          <p>Discover ancient ruins and stunning islands.</p>
          <button className="btn-cta-m">Explore</button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Hungarian.jpg" alt="Hungary" />
          <h3>Hungary</h3>
          <p>Experience the charm of Budapest.</p>
          <button className="btn-cta-m">Explore</button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Bulgaria.jpg" alt="Bulgaria" />
          <h3>Bulgaria</h3>
          <p>Explore Rila Monastery and scenic mountain views.</p>
          <button className="btn-cta-m">Explore</button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Netherlands.jpg" alt="Netherlands" />
          <h3>Netherlands</h3>
          <p>Stroll through tulip fields and iconic windmills.</p>
          <button className="btn-cta-m">Explore</button>
        </div>
        <div className="destination-card">
          <img src="/images/citys/Montenegro.jpg" alt="Montenegro" />
          <h3>Montenegro</h3>
          <p>Discover the stunning Bay of Kotor.</p>
          <button className="btn-cta-m">Explore</button>
        </div>

        <button className="main-search-btn btn-cta-exl">
          Explore All Trips
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
