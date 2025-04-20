// src/pages/Signup.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api'; // Import the signup function
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
    if (!password) {
      setPasswordStrength({ level: '', width: 0 });
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength < 2) {
      setPasswordStrength({ level: 'weak', width: 33 });
    } else if (strength < 4) {
      setPasswordStrength({ level: 'medium', width: 66 });
    } else {
      setPasswordStrength({ level: 'strong', width: 100 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    if (!formData.agreeTerms) {
        setError("You must agree to the Terms and Conditions");
        return;
    }

    try {
        const response = await signup({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,  // ✅ Include confirmPassword
        });

        if (response.msg === "User registered successfully") {
            navigate("/login");
        } else {
            setError(response.msg || "Signup failed");
        }
    } catch (err) {
        setError("Something went wrong. Please try again.");
    }
};

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create an Account</h2>
        <p>Sign up to start booking rides</p>
        {error && <div className="signup-error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <div className="password-strength">
              <div className={`password-strength-meter ${passwordStrength.level}`} style={{ width: `${passwordStrength.width}%` }}></div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div className="terms-checkbox">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
            <label>I agree to the <a href="#">Terms and Conditions</a></label>
          </div>
          <button type="submit" className="btn-primary">Create Account</button>
        </form>
        <p className="signup-redirect">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

export default Signup;