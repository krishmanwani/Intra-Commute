// src/pages/DriverBookings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DriverBookings = ({ match }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const driverId = match.params.driverId; // Get the driverId from the URL

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:6001/api/drivers/upcoming/${driverId}`);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [driverId]);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="driver-bookings-page">
      <h1>Your Upcoming Bookings</h1>

      {bookings.length === 0 ? (
        <p>No upcoming bookings.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <p>Booking ID: {booking._id}</p>
              <p>Status: {booking.status}</p>
              <p>Pick-up: {booking.pickupLocation}</p>
              <p>Drop-off: {booking.dropoffLocation}</p>
              <p>Date: {new Date(booking.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverBookings;
