import React, { useState } from 'react';
import { dehradunLocations } from '../data/dehradunLocations';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    date: '',
    time: '',
    rideType: 'standard'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking Details:', formData);
    // Here you would typically send data to backend
    alert('Ride Booked Successfully!');
  };

  return (
    <div className="booking-form-container">
      <h2>Book Your Ride in Dehradun</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pickup Location:</label>
          <select 
            name="pickup"
            value={formData.pickup} 
            onChange={handleChange} 
            required
          >
            <option value="">-- Select Pickup --</option>
            {dehradunLocations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Drop Location:</label>
          <select 
            name="drop"
            value={formData.drop} 
            onChange={handleChange} 
            required
          >
            <option value="">-- Select Drop --</option>
            {dehradunLocations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ride Type:</label>
          <select 
            name="rideType"
            value={formData.rideType} 
            onChange={handleChange}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="carpool">Carpool</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Book Ride
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

