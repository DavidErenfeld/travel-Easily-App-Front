import { useNavigate } from "react-router-dom";
import CloseIcon from "../../UIComponents/Icons/Close";
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
        <div className="user-sidebar-container">
          <div className="sidebar-user-name">
            <p>{localStorage.getItem("userName")}</p>
          </div>
          <img className="user-sidebar-img" src={profileImg} alt="Profile" />
        </div>

        {isAuthenticated && (
          <p
            className="sidebar-item"
            onClick={() => {
              navigate("/personal-area");
            }}
          >
            Edit profile
          </p>
        )}
        {!isAuthenticated && (
          <p
            className="sidebar-item"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign in
          </p>
        )}
        {!isAuthenticated && (
          <p
            className="sidebar-item"
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign up
          </p>
        )}
        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("features-section");
          }}
        >
          Features
        </p>
        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("how-it-works-section");
          }}
        >
          How It Works
        </p>

        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("contact-section");
          }}
        >
          Contact Us
        </p>

        <p
          className="sidebar-item"
          onClick={() => {
            toggleSidebar();
            handleScrollToSection("hero-section");
          }}
        >
          Home
        </p>

        {isAuthenticated && (
          <p className="sidebar-item" onClick={handleLogout}>
            Logout
          </p>
        )}
      </section>
    </>
  );
};

export default Sidebar;
