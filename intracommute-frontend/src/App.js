import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookRide from "./pages/BookRide";
import DriverDashboard from './components/DriverDashboard';// ⬅️ Adjust as needed
import './App.css';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // For redirection

  // Sync state with localStorage on page load
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedLoginStatus && storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
  }, []);

  // Function to handle login
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUser(user);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "Driver") {
      navigate("/components/DriverDashboard");
    } else {
      navigate("/BookRide");
    }
  };
  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route 
          path="/components/DriverDashboard" 
          element={isLoggedIn && user?.role === "driver" ? <DriverDashboard /> : <Home />} 
        />
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/BookRide" element={<BookRide isLoggedIn={isLoggedIn} />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
      </Routes>
    </>
  );
}

