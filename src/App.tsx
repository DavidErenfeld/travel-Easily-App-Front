import "./App.css";
import Profile from "./components/Forms/Profile";
import Login from "./components/Forms/Logjn";
import Register from "./components/Forms/Register";
import MainCard from "./components/MainCard";
import HomePage from "./components/HomePage";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import TripCard from "./components/TripCard";
import Trips from "./components/Trips";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<Register onClickClose={() => console.log("close")} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mainCard" element={<MainCard />} />
          <Route path="/tripCard" element={<TripCard />} />
          <Route path="/trips" element={<Trips />} />
          {/* <Route path="/tripCard" element={<ViewComment />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
