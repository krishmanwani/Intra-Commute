// src/pages/Signup.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    level: '',
    width: 0
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  const checkPasswordStrength = (password) => {
    // Simple password strength checker
    if (!password) {
      setPasswordStrength({ level: '', width: 0 });
      return;
    }
    
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Set strength level
    if (strength < 2) {
      setPasswordStrength({ level: 'weak', width: 33 });
    } else if (strength < 4) {
      setPasswordStrength({ level: 'medium', width: 66 });
    } else {
      setPasswordStrength({ level: 'strong', width: 100 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
    
    // Here you would normally create a new user account
    // Mock successful registration
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create an Account</h2>
        <p>Sign up to start booking rides</p>
        
        {error && (
          <div className="signup-error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            {formData.password && (
              <>
                <div className="password-strength">
                  <div 
                    className={`password-strength-meter ${passwordStrength.level}`}
                    style={{ width: `${passwordStrength.width}%` }}
                  ></div>
                </div>
                <div className="password-strength-text">
                  {passwordStrength.level === 'weak' && 'Weak'}
                  {passwordStrength.level === 'medium' && 'Medium'}
                  {passwordStrength.level === 'strong' && 'Strong'}
                </div>
              </>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeTerms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          
          <button type="submit" className="btn-primary">
            Create Account
          </button>
        </form>
        
        <div className="signup-divider">
          <span>OR</span>
        </div>
        
        <div className="social-signup">
          <button className="social-btn" title="Signup with Google">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-btn" title="Signup with Facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="social-btn" title="Signup with Apple">
            <i className="fab fa-apple"></i>
          </button>
        </div>
        
        <p className="signup-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;