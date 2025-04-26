import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import './BookRide.css';
import locations from '../pages/locations';

function BookRide({ isLoggedIn }) {
  const [bookingData, setBookingData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    rideType: 'standard',
    paymentMethod: 'card'
  });
  const [isBooked, setIsBooked] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState({
    base: 0,
    distance: 0,
    time: 0,
    total: 0
  });
  const [driverDetails, setDriverDetails] = useState(null);
  const navigate = useNavigate();

  // Static list of locations (you can later fetch from API or DB)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (bookingData.pickup && bookingData.destination) {
      const basePrice = 50;
      let multiplier = 1;

      switch (bookingData.rideType) {
        case 'premium':
          multiplier = 1.5;
          break;
        case 'carpool':
          multiplier = 0.8;
          break;
        default:
          multiplier = 1;
      }

      const distanceFare = 35;
      const timeFare = 15;
      const total = Math.round((basePrice + distanceFare + timeFare) * multiplier);

      setPriceEstimate({
        base: basePrice,
        distance: distanceFare,
        time: timeFare,
        total: total
      });
    }
  }, [bookingData, isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleRideTypeSelect = (type) => {
    setBookingData({
      ...bookingData,
      rideType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBooked(false);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        alert("User not logged in");
        return;
      }

      const response = await axios.post('http://localhost:6001/api/bookings/BookRide', {
        pickupLocation: bookingData.pickup,
        dropoffLocation: bookingData.destination,
        fare: priceEstimate.total,
        vehicleType: bookingData.rideType,
        userId: user._id,
      });

      console.log('Backend Response:', response.data);

      if (response.status === 200) {
        const { driver } = response.data;
        if (driver) {
          setDriverDetails(driver);
          setIsBooked(true);
        } else {
          console.warn("Driver details not found in response.");
          alert("No driver assigned. Please try again.");
        }
      } else {
        alert("Booking failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error booking the ride:", error.response || error);
      alert("An error occurred while booking your ride. Please try again.");
      setIsBooked(false);
    }
  };

  const handleHomeRedirect = () => {
    setIsBooked(false);
    setBookingData({
      pickup: '',
      destination: '',
      date: '',
      time: '',
      rideType: 'standard',
      paymentMethod: '',
    });
    setDriverDetails(null);
    navigate('/');
  };

  return (
    <div className="booking-container">
      <div className="booking-form-container">
        <h2>Book Your Ride</h2>
        <p>Enter details to book your comfortable ride</p>

        {isBooked ? (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h3>Ride Booked Successfully! 🎉</h3>
            <p>Your driver is on the way. Please be ready at your pickup point.</p>

            {driverDetails && (
              <div className="driver-details">
                <h3>🚗 Ride Details</h3>
                <p><strong>Pickup:</strong> {bookingData.pickup}</p>
                <p><strong>Destination:</strong> {bookingData.destination}</p>
                <p><strong>Date:</strong> {bookingData.date}</p>
                <p><strong>Time:</strong> {bookingData.time}</p>
                <p><strong>Fare:</strong> ₹{priceEstimate.total}</p>

                <h3 className="mt-4">👨‍✈️ Assigned Driver</h3>
                <p><strong>Name:</strong> {driverDetails.firstName} {driverDetails.lastName}</p>
                <p><strong>Phone:</strong> {driverDetails.phone}</p>
                <p><strong>Vehicle:</strong> {driverDetails.vehicleType} ({driverDetails.vehicleNumber})</p>
              </div>
            )}

            <button onClick={handleHomeRedirect} className="btn-primary">
              Go to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            {/* Pickup Dropdown */}
            <div className="form-group">
              <label htmlFor="pickup">Pickup Location</label>
              <select
                id="pickup"
                name="pickup"
                value={bookingData.pickup}
                onChange={handleChange}
                required
              >
                <option value="">Select pickup location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.address}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Destination Dropdown */}
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <select
                id="destination"
                name="destination"
                value={bookingData.destination}
                onChange={handleChange}
                required
              >
                <option value="">Select destination</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.address}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Ride Type</label>
            <div className="ride-options">
              <div 
                className={`ride-option ${bookingData.rideType === 'standard' ? 'selected' : ''}`}
                onClick={() => handleRideTypeSelect('standard')}
              >
                <i className="fas fa-car"></i>
                <h4>Standard</h4>
                <p>Comfortable ride at affordable price</p>
              </div>

              <div 
                className={`ride-option ${bookingData.rideType === 'premium' ? 'selected' : ''}`}
                onClick={() => handleRideTypeSelect('premium')}
              >
                <i className="fas fa-car-side"></i>
                <h4>Premium</h4>
                <p>Luxury vehicles with top features</p>
              </div>

              <div 
                className={`ride-option ${bookingData.rideType === 'carpool' ? 'selected' : ''}`}
                onClick={() => handleRideTypeSelect('carpool')}
              >
                <i className="fas fa-users"></i>
                <h4>Carpool</h4>
                <p>Share ride & reduce cost</p>
              </div>
            </div>

            {(bookingData.pickup && bookingData.destination) && (
              <div className="price-estimate">
                <h4>Price Estimate</h4>
                <div className="price-row">
                  <span>Base fare</span>
                  <span>₹{priceEstimate.base}</span>
                </div>
                <div className="price-row">
                  <span>Distance fare</span>
                  <span>₹{priceEstimate.distance}</span>
                </div>
                <div className="price-row">
                  <span>Time fare</span>
                  <span>₹{priceEstimate.time}</span>
                </div>
                <div className="price-total">
                  <span>Total</span>
                  <span>₹{priceEstimate.total}</span>
                </div>
              </div>
            )}

            <div className="payment-options">
              <label>Payment Method</label>
              <div className="payment-option">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={bookingData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <label htmlFor="card">Credit/Debit Card</label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={bookingData.paymentMethod === 'cash'}
                  onChange={handleChange}
                />
                <label htmlFor="cash">Cash on Ride</label>
              </div>

              <div className="payment-option">
                <input
                  type="radio"
                  id="wallet"
                  name="paymentMethod"
                  value="wallet"
                  checked={bookingData.paymentMethod === 'wallet'}
                  onChange={handleChange}
                />
                <label htmlFor="wallet">Digital Wallet</label>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Book Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookRide;
