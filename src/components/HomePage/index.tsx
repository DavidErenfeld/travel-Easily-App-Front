import "./style.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="menu">
        <Link to="/login">
          <button className="btn-m">login</button>
        </Link>
        <Link to="/profile">
          <button className="btn-m">profile</button>
        </Link>
        <Link to="/register">
          <button className="btn-m">register</button>
        </Link>
        <Link to="/trips">
          <button className="btn-m">my trips</button>
        </Link>
      </div>
      <div className="main-buttons">
        <Link to="/add-trip">
          <button className="btn-l">add trip</button>
        </Link>
        <Link to="/trips">
          <button className="btn-l">search trip</button>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
