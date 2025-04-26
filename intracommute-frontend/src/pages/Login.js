import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'User', // Default role is "User"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:6001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          role: credentials.role.toLowerCase(),
        }),
      });

      const data = await response.json();
      const user = data.user;

      if (!response.ok) {
        setError(data.msg || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);

      // ✅ Role-based redirection
      if (user.role.toLowerCase() === 'driver') {
        navigate('/driver-dashboard');
      } else if(user.role.toLowerCase() === 'user') {
        navigate('/BookRide');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    }
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

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={credentials.role || 'User'}
              onChange={handleChange}
              required
            >
              <option value="User">User</option>
              <option value="Driver">Driver</option>
            </select>
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
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
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
