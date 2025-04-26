import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

function DriverLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:6001/api/drivers/login', {
        phone,
        password
      });

      setMessage(res.data.message);
      localStorage.setItem('driver', JSON.stringify(res.data.driver));
      navigate('/driver/dashboard');

      // Optional: Save driver in localStorage
      localStorage.setItem('driver', JSON.stringify(res.data.driver));

      // TODO: Redirect to driver dashboard
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setMessage(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Driver Login</h2>

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
        />

        <button
          type="submit"
          style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold' }}
        >
          Login
        </button>

        {message && (
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'red' }}>{message}</p>
        )}
      </form>
    </div>
  );
}

export default DriverLogin;
