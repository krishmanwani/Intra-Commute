// src/pages/Home.js
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Get to your destination faster and safer</h1>
        <p>Book a ride with our professional drivers anytime, anywhere</p>
        <div className="hero-buttons">
          <Link to="/book-ride" className="btn btn-primary">
            Book a Ride Now
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            Join Our Network
          </Link>
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