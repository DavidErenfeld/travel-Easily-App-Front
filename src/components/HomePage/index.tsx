import { Link } from "react-router-dom";
import "./style.css";
import Header from "../Header";

const HomePage = () => {
  return (
    <section className="main-page-section">
      <Header />
      <h1 className="main-title">The new way to travel</h1>
      <div className="main-buttons">
        <Link to="/AddTrip">
          <button className="btn-el">add trip</button>
        </Link>
        <Link to="/trips">
          <button className="btn-el">search trip</button>
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
