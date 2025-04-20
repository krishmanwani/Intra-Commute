// src/components/Navbar.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Intra-Commute
        </Link>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/book-ride" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                  Book Ride
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-links-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-links-btn" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
