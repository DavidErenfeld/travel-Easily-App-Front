import "./style.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CloseIcon from "../../UIComponents/Icons/Close";

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
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleProfileClick = () => {
    navigate("/personal-area");
  };

  const sidebarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
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
        <div className="user-sidebar-container" onClick={handleProfileClick}>
          <div className="sidebar-user-name">
            <p>{localStorage.getItem("userName")}</p>
          </div>
          <img className="user-sidebar-img" src={profileImg} alt="Profile" />
        </div>

        {isAuthenticated && (
          <Link to="/personalArea">
            <h1 className="sidebar-item">Edit profile</h1>
          </Link>
        )}

        {!isAuthenticated && (
          <Link to="/login">
            <h1 className="sidebar-item">Sign In</h1>
          </Link>
        )}

        {!isAuthenticated && (
          <Link to="/register">
            <h1 className="sidebar-item">Sign Up</h1>
          </Link>
        )}

        <Link to="/HowItWorks">
          <h1 className="sidebar-item">HowItWorks</h1>
        </Link>

        <Link to="/ContactUs">
          <h1 className="sidebar-item">Contact us</h1>
        </Link>

        <Link to="/">
          <h1 className="sidebar-item">Home</h1>
        </Link>

        {isAuthenticated && (
          <h1 className="sidebar-item" onClick={handleLogout}>
            Logout
          </h1>
        )}

        <div className="close-sidebar">
          <CloseIcon color="#000" onClose={toggleSidebar} />
        </div>
      </section>
    </>
  );
};

export default Sidebar;
