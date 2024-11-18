// Header.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";
import { CirclePlus, Plus, Search } from "lucide-react";
import Sidebar from "../Menus/Sidebar";
import "./style.css";

const Header = () => {
  const { logout } = useAuth();
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("imgUrl") || "/images/user.png"
  );
  const [isUserConect, setIsUserConect] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // state לניהול מצב התפריט
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserConect(false);
      setProfileImg("/images/user.png");
      setIsSidebarOpen(false);
    } catch (error) {
      setProfileImg("/images/user.png");
      setIsSidebarOpen(false);
      console.log(error);
    }
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
        <Sidebar
          profileImg={profileImg}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />

        <Link to="/">
          <h1 className="sidebar logo">TRAVEL easily</h1>
        </Link>

        {/* {isUserConect && (
          <p onClick={() => navigate("/addTrip")} className="sidbar menu-item">
            Add trip
          </p>
        )} */}

        {!isSidebarOpen && (
          <>
            {localStorage.getItem("loggedUserId") ? (
              <div className="menu ">
                <p
                  onClick={() => navigate("/")}
                  className="menu-item connectet-menu"
                >
                  Home
                </p>

                <p
                  onClick={() => navigate("/addTrip")}
                  className="menu-item connectet-menu"
                >
                  Add trip
                </p>

                <p
                  onClick={() => navigate("/tripForm")}
                  className="menu-item connectet-menu"
                >
                  Explore Nearby
                </p>

                <img
                  className="user-main-page-img"
                  src={profileImg}
                  alt="Profile"
                  onClick={toggleSidebar}
                />
              </div>
            ) : (
              <div className="menu">
                <p onClick={() => navigate("/login")} className="menu-item">
                  Sign in
                </p>
              </div>
            )}

            <section className="mobile-menu">
              <CirclePlus
                className="mobile-menu-icon icon"
                onClick={() => navigate("/addTrip")}
              />
              <Search
                className="mobile-menu-icon icon"
                onClick={() => navigate("/searchTrip/advancedSearch")}
              />
              <img
                className="user-main-page-img"
                src={profileImg}
                alt="Profile"
                onClick={toggleSidebar}
              />
            </section>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
