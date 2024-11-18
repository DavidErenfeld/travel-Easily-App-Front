import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const MenuBar = () => {
  const navigate = useNavigate();
  return (
    <section className="menu-bar">
      <Link to="/searchTrip/advancedSearch">
        <div className="menu-sub-item">Advanced search</div>
      </Link>
      <Link to="/searchTrip">
        <div className="menu-sub-item">All Trips</div>
      </Link>
      <Link to="/myTrips">
        <div className="menu-sub-item">My Trips</div>
      </Link>
      <Link to="/favoriteTrips">
        <div className="menu-sub-item">Favorite Trips</div>
      </Link>
      <Link to="/addTrip">
        <div className="menu-sub-item">Add Trip</div>
      </Link>
      <Link to="/tripForm">
        <div className="menu-sub-item">Explore Nearby</div>
      </Link>
    </section>
  );
};
export default MenuBar;
