import "./style.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";

const Header = () => {
  const { logout } = useAuth();
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("imgUrl") || "/images/user.png"
  );
  const [isUserConect, setIsUserConect] = useState(false); // סטייט שמציין אם המשתמש מחובר

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserConect(false); // עדכון הסטייט לאחר התנתקות
      setProfileImg("/images/user.png"); // עדכון התמונה לאחר התנתקות
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // מעדכן את התמונה כשמשתמש משנה את כתובת התמונה ב-LocalStorage
    const handleStorageChange = () => {
      setProfileImg(localStorage.getItem("imgUrl") || "/images/user.png");
    };

    window.addEventListener("storage", handleStorageChange);

    if (localStorage.getItem("loggedUserId")) setIsUserConect(true); // בדיקה אם המשתמש מחובר

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <>
      <header className="main-page-header">
        <h1 className="logo">TRAVEL EASILY</h1>
        <div className="menu">
          {isUserConect ? (
            <div className="menu">
              <h1 className="menu-item" onClick={handleLogout}>
                Logout
              </h1>
              <Link to="/">
                <h1 className="menu-item">home</h1>
              </Link>
              <Link to="/myTrips">
                <h1 className="menu-item">my trips</h1>
              </Link>
              <img
                className="user-main-page-img"
                src={profileImg}
                alt="Profile"
              />
            </div>
          ) : (
            <div className="menu">
              <Link to="/login">
                <h1 className="menu-item">login</h1>
              </Link>
              <Link to="/profile">
                <h1 className="menu-item">profile</h1>
              </Link>
              <Link to="/register">
                <h1 className="menu-item">register</h1>
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
