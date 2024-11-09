import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";
import Header from "../Header";

const HomePage = () => {
  return (
    <>
      <Header />
      <section className="main-page-section">
        <div className="main-title-element">
          <h1 className="main-title">The new way to travel</h1>
        </div>
        <div className="main-buttons">
          <Link to="/AddTrip">
            <button className="btn-el">Add Trip</button>
          </Link>
          <Link to="/searchTrip">
            <button className="btn-el">Search Trip</button>
          </Link>
          <Link to="/tripForm">
            <button className="btn-el">Find Nearby Attractions</button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
