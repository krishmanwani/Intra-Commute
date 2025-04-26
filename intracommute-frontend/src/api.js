const API_URL = "http://localhost:6001/api";

// Signup function
// Signup function
export const signup = async (userData) => {
  try {
    // Prepare the payload
    const payload = {
      ...userData,
      role: userData.role,
    };

    // Conditionally include vehicle fields only for drivers
    if (payload.role === "Driver") {
      payload.vehicleType = userData.vehicleType;
      payload.vehicleNumber = userData.vehicleNumber;
      payload.phone = userData.phone;
    }

    // Make the POST request to signup API
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Log the status and response text to help debug
    const responseText = await response.text(); // Get the raw response text
    console.log("Response Status:", response.status); // Log response status
    console.log("Response Text:", responseText); // Log response text

    // Check for unsuccessful response and handle it
    if (!response.ok) {
      // Try parsing the error message from the response
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
      console.error("Signup Error:", errorData);
      throw new Error(errorData.msg || "Signup failed");
    }

    // Parse and return the successful response
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Signup Network Error:", error);
    throw new Error(error.message || "Something went wrong during signup");
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Check for unsuccessful response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login Error:", errorData); // Log the error for debugging
      throw new Error(errorData.msg || "Login failed");
    }

    // Assuming the token is returned upon success
    const data = await response.json();
    console.log("Login successful, token:", data.token);

    // Store the token in localStorage for future requests
    localStorage.setItem("authToken", data.token);

    return data; // Return the user data and token
  } catch (error) {
    console.error("Login Network Error:", error);
    throw new Error(error.message || "Something went wrong during login");
  }
};

// Fetch available vehicles
export const getAvailableVehicles = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    // Check if token exists
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Include the token in the Authorization header for authenticated routes
    const response = await fetch(`${API_URL}/vehicles/available`, {
      method: "GET", // Assuming you are just fetching the data
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Add token for authentication
      },
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fetch Vehicles Error:", errorData); // Log the error for debugging
      throw new Error(errorData.msg || "Failed to fetch available vehicles");
    }

    return response.json(); // Return the vehicle data on success
  } catch (error) {
    console.error("Fetch Vehicles Network Error:", error);
    throw new Error(error.message || "Something went wrong while fetching vehicles");
  }
};
