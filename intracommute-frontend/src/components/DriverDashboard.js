import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DriverDashboard.css';

function DriverDashboard({ isLoggedIn, user }) {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    currentRide: null,
    rating: 0,
    totalSuccessfulRides: 0,
    canceledRides: 0,
    todaysIncome: 0,
    totalKmDriven: 0,
  });

  const [driverDetails, setDriverDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    joinedDate: '',
  });

  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role.toLowerCase() !== "driver") {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:6001/api/driver-dashboard/${storedUser._id}`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`
          }
        });

        setDashboardData(data);

        // Update driver details from backend response if available
        const profile = data.driverProfile || {};
        setDriverDetails({
          firstName: storedUser.firstName || '',
          lastName: storedUser.lastName || '',
          email: storedUser.email || '',
          phone: profile.phone || storedUser.phone || '',
          vehicleType: profile.vehicleType || storedUser.vehicleType || '',
          vehicleNumber: profile.vehicleNumber || storedUser.vehicleNumber || '',
          joinedDate: profile.joinedDate || storedUser.createdAt || '',
        });
      } catch (err) {
        console.error('Error fetching driver dashboard data', err);
        setErrorMessage('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleWithdraw = () => {
    setSuccessMessage('');
    setErrorMessage('');

    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    if (amount <= dashboardData.todaysIncome) {
      setSuccessMessage(`✅ Successfully withdrawn ₹${amount.toFixed(2)}`);
      setWithdrawAmount('');

      setDashboardData(prev => ({
        ...prev,
        monthlyIncome: prev.monthlyIncome - amount,
      }));

      setTimeout(() => {
        navigate("/driver-dashboard");
      }, 1500);
    } else {
      setErrorMessage('❌ Insufficient funds for withdrawal');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Driver Dashboard</h2>
        <p>Welcome back, {driverDetails.firstName}! Here's your performance summary</p>
      </div>

      <div className="driver-profile">
        <div className="profile-header">
          <div className="profile-image">
            <div className="profile-initial">{driverDetails.firstName?.charAt(0)}</div>
          </div>

          <div className="profile-info">
            <h3>{driverDetails.firstName} {driverDetails.lastName}</h3>
            <div className="profile-details">
              <div className="detail-item"><i className="fas fa-envelope"></i><span>{driverDetails.email}</span></div>
              <div className="detail-item"><i className="fas fa-phone"></i><span>{driverDetails.phone}</span></div>
              <div className="detail-item"><i className="fas fa-calendar-alt"></i><span>Joined: {formatDate(driverDetails.joinedDate)}</span></div>
            </div>
          </div>
        </div>

        <div className="vehicle-details">
          <div className="detail-card">
            <h4>Vehicle Type</h4>
            <p>{driverDetails.vehicleType || 'Not specified'}</p>
          </div>
          <div className="detail-card">
            <h4>Vehicle Number</h4>
            <p>{driverDetails.vehicleNumber || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-item"><h3>Monthly Income</h3><p>₹{dashboardData.monthlyIncome.toFixed(2)}</p></div>
        <div className="summary-item"><h3>Today's Income</h3><p>₹{dashboardData.todaysIncome.toFixed(2)}</p></div>
        <div className="summary-item"><h3>Total Rides</h3><p>{dashboardData.totalSuccessfulRides}</p></div>
        <div className="summary-item"><h3>Canceled Rides</h3><p>{dashboardData.canceledRides}</p></div>
        <div className="summary-item"><h3>Rating</h3><p>{dashboardData.rating.toFixed(1)}/5</p></div>
        <div className="summary-item"><h3>Total KM Driven</h3><p>{dashboardData.totalKmDriven} km</p></div>
      </div>

      {dashboardData.currentRide && (
        <div className="current-ride">
          <h3>Current Ride</h3>
          <div className="current-ride-details">
            <div className="ride-detail"><h4>PICKUP</h4><p>{dashboardData.currentRide.pickup}</p></div>
            <div className="ride-detail"><h4>DESTINATION</h4><p>{dashboardData.currentRide.destination}</p></div>
            <div className="ride-detail"><h4>PASSENGER</h4><p>{dashboardData.currentRide.passengerName}</p></div>
            <div className="ride-detail"><h4>FARE</h4><p>₹{dashboardData.currentRide.fare.toFixed(2)}</p></div>
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
