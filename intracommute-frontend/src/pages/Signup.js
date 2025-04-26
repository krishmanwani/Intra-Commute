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
    agreeTerms: false,
    role: 'User', // Default role is 'User'
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
  });

  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    level: '',
    width: 0,
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
    setError('');
  
    // Validate required fields
    if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields (first name, email, password)');
      return;
    }
  
    // Validate if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return;
    }
  
    // Validate driver-specific fields
    if (formData.role === 'Driver') {
      if (!formData.phone || !formData.vehicleType || !formData.vehicleNumber) {
        setError('Please fill in all driver fields (phone, vehicle type, vehicle number)');
        return;
      }
  
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Please enter a valid phone number');
        return;
      }
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    try {
      const response = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role === 'Driver' ? 'Driver' : 'User', // Pass 'Driver' or 'User' as is
        phone: formData.role === 'Driver' ? formData.phone : undefined,
        vehicleType: formData.role === 'Driver' ? formData.vehicleType : undefined,
        vehicleNumber: formData.role === 'Driver' ? formData.vehicleNumber : undefined,
      });
  
      console.log(response); // Inspect the response for any issues
  
      if (response.msg && response.msg.toLowerCase().includes('registered')) {
        localStorage.setItem('user', JSON.stringify({
          
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          phone: response.user.phone, // Ensure phone is included
          vehicleType: response.user.vehicleType, // Ensure vehicleType is included
          vehicleNumber: response.user.vehicleNumber, // Ensure vehicleNumber is included
          role: response.user.role,
        }));
         setError('');
         alert('Signup successful! Please login.');
        navigate('/login'); // ✅ Redirect after success
        } else {
          setError(response.message || 'Signup failed');
        }
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Something went wrong');
         }
      };
  

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Create an Account</h2>
        <p>Sign up to start booking rides</p>
        {error && <div className="signup-error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Basic fields */}
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

          <div className="form-group">
            <label htmlFor="role">Sign up as:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          {/* Driver-specific fields */}
          {formData.role === 'Driver' && (
            <>
              <div className="form-group">
                <label htmlFor="phone">Phone Number*</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type*</label>
                <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleNumber">Vehicle Number*</label>
                <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
              </div>
            </>
          )}

          <div className="terms-checkbox">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
            <label>
              I agree to the{' '}
              <button
                type="button"
                className="terms-button"
                onClick={() => { alert('Display Terms and Conditions here'); }}
                style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Terms and Conditions
              </button>
            </label>
          </div>

          <button type="submit" className="btn-primary">Create Account</button>
        </form>

        <p className="signup-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
