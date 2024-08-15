import { Link } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../Context/AuthContext";

const HomePage = () => {
  const { logout } = useAuth(); // שימוש בפונקציה מה-Context

  const handleLogout = async () => {
    try {
      await logout(); // קריאה לפונקציית ההתנתקות מה-Context
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="menu">
        <button className="btn-m" onClick={handleLogout}>
          Logout
        </button>

        <Link to="/login">
          <button className="btn-m">login</button>
        </Link>
        <Link to="/profile">
          <button className="btn-m">profile</button>
        </Link>
        <Link to="/register">
          <button className="btn-m">register</button>
        </Link>
        <Link to="/myTrips">
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
