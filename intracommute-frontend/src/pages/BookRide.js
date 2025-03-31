// src/pages/BookRide.js
import { useState } from 'react';

function BookRide() {
  const [bookingData, setBookingData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    rideType: 'standard',
  });
  const [isBooked, setIsBooked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally submit the booking to your backend
    
    // Show success message
    setIsBooked(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsBooked(false);
      setBookingData({
        pickup: '',
        destination: '',
        date: '',
        time: '',
        rideType: 'standard',
      });
    }, 3000);
  };

  return (
    <div className="booking-container">
      <h2>Book Your Ride</h2>
      
      {isBooked ? (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <h3>Ride Booked Successfully!</h3>
          <p>Your driver will pick you up at the scheduled time.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="pickup">Pickup Location</label>
            <input
              type="text"
              id="pickup"
              name="pickup"
              value={bookingData.pickup}
              onChange={handleChange}
              placeholder="Enter pickup address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={bookingData.destination}
              onChange={handleChange}
              placeholder="Enter destination address"
              required
            />
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
          
          <div className="form-group">
            <label htmlFor="rideType">Ride Type</label>
            <select
              id="rideType"
              name="rideType"
              value={bookingData.rideType}
              onChange={handleChange}
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="carpool">Carpool</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">
            Book Now
          </button>
        </form>
      )}
    </div>
  );
}

export default BookRide;