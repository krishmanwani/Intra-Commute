import api from './api';

export const getAvailableVehicles = async () => {
  try {
    const response = await api.get('/api/rides/available'); // Getting available rides
    return response.data; // Return the response from the backend
  } catch (error) {
    // Handling any errors during the fetch operation
    throw error.response?.data?.error || 'Failed to fetch vehicles';
  }
};
