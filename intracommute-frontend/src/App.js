import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookRide from "./pages/BookRide";
import './App.css';

export default function App() {
  // Simple auth state that would be replaced with proper auth context in a real app
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login state
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/book-ride" 
          element={
            <BookRide isLoggedIn={isLoggedIn} />
          } 
        />
      </Routes>
    </Router>
  );
}