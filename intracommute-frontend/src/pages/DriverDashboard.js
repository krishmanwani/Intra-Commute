import { useState, useEffect } from 'react';
import axios from 'axios';
import './DriverDashboard.css';

function DriverDashboard({ isLoggedIn, user }) {
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    totalSuccessfulRides: 0,
    rating: 0,
    canceledRides: 0,
    todaysIncome: 0,
    totalKmDriven: 0,
    currentRide: null
  });
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // For development - add mock data if not connected to backend
    const useMockData = true; // Set to false when your backend is ready
    
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }
    
    if (useMockData) {
      // Use mock data for development
      setTimeout(() => {
        setDashboardData({
          monthlyIncome: 12500,
          todaysIncome: 1500,
          totalSuccessfulRides: 43,
          canceledRides: 5,
          rating: 4.7,
          totalKmDriven: 1250,
          currentRide: {
            pickup: "Cyber City",
            destination: "Airport Terminal 3",
            passengerName: "John Smith",
            fare: 450
          }
        });
        setLoading(false);
      }, 1000);
      return;
    }

    // Fetch driver data from backend
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`/api/driver-dashboard/${user._id}`);
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching driver dashboard data', err);
        setErrorMessage('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoggedIn, user]);

  const handleWithdraw = () => {
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate amount
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    // Simple mock withdrawal process
    if (amount <= dashboardData.monthlyIncome) {
      setSuccessMessage(`Successfully withdrawn ₹${amount.toFixed(2)}`);
      setWithdrawAmount('');
      
      // In a real app, you would update the balance after withdrawal
      setDashboardData({
        ...dashboardData,
        monthlyIncome: dashboardData.monthlyIncome - amount
      });
    } else {
      setErrorMessage('Insufficient funds for withdrawal');
    }
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Driver Dashboard</h2>
        <p>Welcome back{user ? `, ${user.name}` : ''}! Here's your performance summary</p>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-item">
          <h3>Monthly Income</h3>
          <p><span className="currency">₹</span>{dashboardData.monthlyIncome.toFixed(2)}</p>
        </div>
        
        <div className="summary-item">
          <h3>Today's Income</h3>
          <p><span className="currency">₹</span>{dashboardData.todaysIncome.toFixed(2)}</p>
        </div>
        
        <div className="summary-item">
          <h3>Total Rides</h3>
          <p>{dashboardData.totalSuccessfulRides}</p>
        </div>
        
        <div className="summary-item">
          <h3>Canceled Rides</h3>
          <p>{dashboardData.canceledRides}</p>
        </div>
        
        <div className="summary-item">
          <h3>Rating</h3>
          <p>{dashboardData.rating.toFixed(1)}</p>
        </div>
        
        <div className="summary-item">
          <h3>Distance Driven</h3>
          <p>{dashboardData.totalKmDriven} km</p>
        </div>
      </div>

      {dashboardData.currentRide && (
        <div className="current-ride">
          <h3>Current Ride</h3>
          <div className="current-ride-details">
            <div className="ride-detail">
              <h4>PICKUP</h4>
              <p>{dashboardData.currentRide.pickup}</p>
            </div>
            <div className="ride-detail">
              <h4>DESTINATION</h4>
              <p>{dashboardData.currentRide.destination}</p>
            </div>
            <div className="ride-detail">
              <h4>PASSENGER</h4>
              <p>{dashboardData.currentRide.passengerName}</p>
            </div>
            <div className="ride-detail">
              <h4>FARE</h4>
              <p>₹{dashboardData.currentRide.fare.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="withdraw-section">
        <h3>Withdraw Earnings</h3>
        <div className="withdraw-input">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
          />
          <button className="withdraw-btn" onClick={handleWithdraw}>Withdraw</button>
        </div>
        {successMessage && <p className="withdraw-message">{successMessage}</p>}
        {errorMessage && <p className="withdraw-message error">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default DriverDashboard;