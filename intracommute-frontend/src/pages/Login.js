// src/pages/Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally perform authentication
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Mock successful login
    if (onLogin) onLogin();
    navigate('/book-ride');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Welcome Back</h2>
        <p>Log in to your account to book rides</p>
        
        {error && (
          <div className="login-error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="remember-forgot">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>
        
        <div className="login-divider">
          <span>OR</span>
        </div>
        
        <div className="social-login">
          <button className="social-btn" title="Login with Google">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-btn" title="Login with Facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="social-btn" title="Login with Apple">
            <i className="fab fa-apple"></i>
          </button>
        </div>
        
        <p className="login-redirect">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;