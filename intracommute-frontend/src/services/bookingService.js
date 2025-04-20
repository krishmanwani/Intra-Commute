import api from './api';

export const bookRide = async (pickup, destination, vehicleType) => {
  try {
    // Making a POST request to the backend to book a ride
    const response = await api.post('/api/bookings/book', {
      pickup,
      destination,
      vehicleType,
    });
    
    return response.data; // The backend's response data, for example, booking confirmation
  } catch (error) {
    // Catching errors from the request and throwing an appropriate message
    throw error.response?.data?.error || 'Booking failed';
  }
};
