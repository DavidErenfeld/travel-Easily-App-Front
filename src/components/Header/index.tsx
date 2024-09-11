import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";
import "./style.css";

const Header = () => {
  const { logout } = useAuth();
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("imgUrl") || "/images/user.png"
  );
  const [isUserConect, setIsUserConect] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserConect(false);
      setProfileImg("/images/user.png");
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = () => {
    navigate("/personal-area");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setProfileImg(localStorage.getItem("imgUrl") || "/images/user.png");
    };

    window.addEventListener("storage", handleStorageChange);

    if (localStorage.getItem("loggedUserId")) setIsUserConect(true);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <header className="main-page-header">
        <h1 className="logo">TRAVEL easily</h1>
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
                onClick={handleProfileClick}
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
