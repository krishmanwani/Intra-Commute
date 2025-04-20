import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookRide from "./pages/BookRide";
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync state with localStorage on page load
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(storedLoginStatus);
  }, []);

  // Function to handle login
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user)); // Save user data
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user"); // Remove user data
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book-ride" element={<BookRide isLoggedIn={isLoggedIn} />} />
      </Routes>
    </Router>
  );
}

