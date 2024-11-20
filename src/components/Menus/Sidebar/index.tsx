import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { scroller } from "react-scroll";
import "./style.css";

interface SidebarProps {
  profileImg: string;
  isOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

const Sidebar = ({
  profileImg,
  isOpen,
  toggleSidebar,
  handleLogout,
}: SidebarProps) => {
  const { t } = useTranslation();
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();

  const sidebarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleScrollToSection = (section: string) => {
    navigate("/");

    setTimeout(() => {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -50,
      });
    }, 100);
  };

  return (
    <>
      {isOpen && (
        <div
          className="overlay"
          onClick={(event) => {
            event.stopPropagation();
            toggleSidebar();
          }}
        ></div>
      )}
      <section
        className={`sidebar-section ${isOpen ? "open" : ""}`}
        onClick={sidebarClick}
      >
        <div
          className="user-sidebar-container"
          onClick={() => {
            navigate("/personal-area");
          }}
        >
          <div className="sidebar-user-name">
            <p>{localStorage.getItem("userName")}</p>
          </div>
          <img
            className="user-sidebar-img"
            src={profileImg}
            alt={t("sidebar.profileAlt")}
          />
        </div>

        {isAuthenticated && (
          <p
            className="sidebar-item"
            onClick={() => {
              navigate("/personal-area");
            }}
          >
            {t("sidebar.editProfile")}
          </p>
        )}
        {!isAuthenticated && (
          <p
            className="sidebar-item"
            onClick={() => {
              navigate("/login");
            }}
          >
            {t("sidebar.signIn")}
          </p>
        )}
        {!isAuthenticated && (
          <p
            className="sidebar-item"
            onClick={() => {
              navigate("/register");
            }}
          >
            {t("sidebar.signUp")}
          </p>
        )}
        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("features-section");
          }}
        >
          {t("sidebar.aboutUs")}
        </p>
        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("how-it-works-section");
          }}
        >
          {t("sidebar.howItWorks")}
        </p>
        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("contact-section");
          }}
        >
          {t("sidebar.contactUs")}
        </p>
        <p
          className="sidebar-item"
          onClick={() => {
            navigate("./secontHomPage");
          }}
        >
          {t("sidebar.home")}
        </p>

        {isAuthenticated && (
          <p className="sidebar-item" onClick={handleLogout}>
            {t("sidebar.logout")}
          </p>
        )}
      </section>
    </>
  );
};

export default Sidebar;
