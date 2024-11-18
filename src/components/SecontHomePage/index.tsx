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

const SecontHomePage = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [showOptions, setShowOptions] = useState(true);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [filteredTrips, setFilteredTrips] = useState<ITrips[]>([]);

  const { trips, refreshTrips } = useTrips();

  const renderTrips = (tripsList: ITrips[]) => {
    return tripsList.map((trip) => (
      <article className="trip-list-item" key={trip._id}>
        <TripCard trip={trip} />
      </article>
    ));
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 100);
    };

    const handlePopState = () => {
      // קריאה ל-resetSearch כאשר לוחצים על "חזור"
      resetSearch();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetSearch = () => {
    setShowOptions(true);
    setFilteredTrips([]);
    setSelectedCountry("");
    setShowNoResultsMessage(false);
  };

  const searchByCountry = (country: string) => {
    setIsLoading(true);
    setSelectedCountry(country);
    setShowOptions(false);

    // עדכון היסטוריה למצב תוצאות חיפוש
    window.history.pushState(
      { showOptions: false },
      "",
      window.location.pathname
    );

    const filtered = trips.filter((trip) => trip.country === country);
    if (filtered.length > 0) {
      setFilteredTrips(filtered);
    } else {
      setShowNoResultsMessage(true);
      setTimeout(() => {
        setShowNoResultsMessage(false);
        resetSearch();
      }, 3000);
    }

    setIsLoading(false);
  };

  const exploreAllTrips = async () => {
    setIsLoading(true);
    setShowOptions(false);

    // עדכון היסטוריה למצב תוצאות חיפוש
    window.history.pushState(
      { showOptions: false },
      "",
      window.location.pathname
    );

    try {
      await refreshTrips();
      setFilteredTrips(trips);
    } catch (error) {
      console.error("Error fetching all trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <MenuBar />

      {showOptions ? (
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
            onClick={exploreAllTrips}
          >
            Explore All Countries
          </button>
        </section>
      ) : (
        <section className="trips-section section">
          {isLoading ? (
            <div className="trips-loader main-loader-section">
              <LoadingDots />
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="no-trips-container">
              <p className="no-trips-message">
                No trips found for your search criteria.
              </p>
              <button className="btn-cta-exl" onClick={resetSearch}>
                Back to Destinations
              </button>
            </div>
          ) : (
            renderTrips(filteredTrips)
          )}
        </section>
      )}

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
