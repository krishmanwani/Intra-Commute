// src/services/bookingService.js
import api from './api';

/**
 * @param {Object} booking
 * @param {string} booking.pickup
 * @param {string} booking.destination
 * @param {string} booking.rideType
 */
export const bookRide = async (booking) => {
  try {
    const response = await api.post('/api/bookings/book', booking);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Booking failed';
  }
};
