import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Profile from "./components/Forms/Profile";
import Login from "./components/Forms/Login";
import Register from "./components/Forms/Register";
import HomePage from "./components/HomePage";
import Trips from "./components/TripComponents/Trips";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import TripDetails from "./components/TripComponents/TripDetails";
import { AuthProvider } from "./Context/AuthContext";
import { TripProvider } from "./Context/TripContext";
import MyTrips from "./components/TripComponents/myTrips";
import AddTrip from "./components/AddTrip";
import UpdateTrip from "./components/TripComponents/UpdateTrip";
import CreateTrip from "./components/CreateTrip";

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/myTrips" element={<MyTrips />} />
              <Route path="/addTrip" element={<AddTrip />} />
              <Route path="/create-trip" element={<CreateTrip />} />
            </Route>
            <Route path="/trips" element={<Trips />} />
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
