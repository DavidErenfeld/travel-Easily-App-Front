import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { TripProvider } from "./Context/TripContext";
import SocketListener from "./components/SocketListener";
import Profile from "./components/Forms/Profile";
import Login from "./components/Forms/Login";
import Register from "./components/Forms/Register";
import HomePage from "./components/HomePage";
import Trips from "./components/TripComponents/AllTrips";
import ProtectedRoute from "./components/ProtectedRoute";
import TripDetails from "./components/TripComponents/TripDetails";
import MyTrips from "./components/TripComponents/myTrips";
import AdvancedSearch from "./components/AdvancedSearch";
import PersonalArea from "./components/PersonalArea";
import TripForm from "./components/TripComponents/TripForm";
import CreateTrip from "./components/TripComponents/CreateTrip";
import ForgotPassword from "./components/Forms/ForgotPassword";
import ResetPassword from "./components/Forms/ResetPassword";
import FavoriteTrips from "./components/TripComponents/FavoriteTrips";
import TripFormPage from "./components/PlacesSearch/PlacesSearchPage";
import { useEffect } from "react";
import socket from "./Hooks/socketInstance";
import SecontHomePage from "./components/SecontHomePage";
import "./App.css";
import "./index.css";
import AllTrips from "./components/TripComponents/AllTrips";
import TripsList from "./components/TripComponents/Trips";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      socket.auth = { token };
      if (!socket.connected) {
        socket.connect();
      }
    }
  }, []);
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <SocketListener />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/secontHomPage" element={<SecontHomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/searchTrip" element={<AllTrips />} />
            <Route path="/trips/:country" element={<TripsList />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/searchTrip/trip/:id" element={<TripDetails />} />
            <Route
              path="/searchTrip/advancedSearch"
              element={<AdvancedSearch />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/personal-area" element={<PersonalArea />} />
              <Route path="/AddTrip" element={<TripForm />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/myTrips" element={<MyTrips />} />
              <Route path="/favoriteTrips" element={<FavoriteTrips />} />
              <Route path="/tripForm" element={<TripFormPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
