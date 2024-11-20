import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";
import { CirclePlus, Search } from "lucide-react";

import Sidebar from "../Menus/Sidebar";
import { useTranslation } from "react-i18next";
import "./style.css";
import LanguageSwitcher from "../UIComponents/LanguageSwitcher";

const Header = () => {
  const { logout } = useAuth();
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("imgUrl") || "/images/user.png"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileImg("/images/user.png");
      setIsSidebarOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setProfileImg(localStorage.getItem("imgUrl") || "/images/user.png");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="main-page-header">
      <Sidebar
        profileImg={profileImg}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />

      <Link to="/">
        <h1 className="sidebar logo">{t("appName")}</h1>
      </Link>

      {!isSidebarOpen && (
        <>
          {localStorage.getItem("loggedUserId") ? (
            <div className="menu">
              <p
                onClick={() => navigate("/")}
                className="menu-item connectet-menu"
              >
                {t("home")}
              </p>

              <p
                onClick={() => navigate("/addTrip")}
                className="menu-item connectet-menu"
              >
                {t("addTrip")}
              </p>

              <p
                onClick={() => navigate("/tripForm")}
                className="menu-item connectet-menu"
              >
                {t("exploreNearby")}
              </p>
              <LanguageSwitcher />
              <img
                className="user-main-page-img"
                src={profileImg}
                alt={t("profile")}
                onClick={toggleSidebar}
              />
            </div>
          ) : (
            <div className="menu">
              <LanguageSwitcher />
              <img
                className="user-main-page-img"
                src={profileImg}
                alt={t("profile")}
                onClick={toggleSidebar}
              />
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
            <LanguageSwitcher />
            <img
              className="user-main-page-img"
              src={profileImg}
              alt={t("profile")}
              onClick={toggleSidebar}
            />
          </section>
        </>
      )}
    </header>
  );
};

export default Header;
