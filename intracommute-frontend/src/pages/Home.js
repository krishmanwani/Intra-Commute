// src/pages/Home.js
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home({ isLoggedIn }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [isLoggedIn]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Get to your destination faster and safer</h1>
        <p>Book a ride with our professional drivers anytime, anywhere</p>
        <div className="hero-buttons">
          <Link to="/book-ride" className="btn btn-primary">
            Book a Ride Now
          </Link>
          {!isLoggedIn ? (
            <Link to="/signup" className="btn btn-secondary">
              Join Our Network
            </Link>
          ) : (
            <p>Welcome, {user?.name}! 🎉</p>
          )}
        </div>
      </div>
      <div className="features-section">
        <div className="feature-card">
          <i className="fas fa-car feature-icon"></i>
          <h3>Comfortable Rides</h3>
          <p>Modern vehicles with professional drivers</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-clock feature-icon"></i>
          <h3>24/7 Service</h3>
          <p>Available whenever you need us</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-shield-alt feature-icon"></i>
          <h3>Safe Journeys</h3>
          <p>Security and safety are our top priorities</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
