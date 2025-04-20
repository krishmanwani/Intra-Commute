const API_URL = "http://localhost:6001/api";

export const signup = async (userData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const getAvailableVehicles = async () => {
  const response = await fetch(`${API_URL}/vehicles/available`);
  return response.json();
};
