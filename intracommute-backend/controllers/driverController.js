const bcrypt = require('bcryptjs');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');

// Register Driver
const registerDriver = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, role, phone, vehicleType, vehicleNumber } = req.body;

  // Validate input fields
  if (!firstName || !lastName || !phone || !password || !confirmPassword || !vehicleType || !vehicleNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if the driver is already registered
    const existingDriver = await Driver.findOne({ phone });
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new driver
    const newDriver = new Driver({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || 'driver', // Default to 'driver' if no role is provided
      vehicleType,
      vehicleNumber,
    });

    // Save driver to the database
    await newDriver.save();
    res.status(201).json({ message: 'Driver registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Driver
const loginDriver = async (req, res) => {
  const { phone, password } = req.body;

  // Validate input fields
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  try {
    // Find the driver by phone
    const driver = await Driver.findOne({ phone });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      driver: {
        id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.phone,
        vehicleType: driver.vehicleType,
        vehicleNumber: driver.vehicleNumber,
        isAvailable: driver.isAvailable,
        role: driver.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Driver Availability
const updateDriverAvailability = async (req, res) => {
  const { isAvailable } = req.body;

  // Validate availability field
  if (typeof isAvailable !== 'boolean') {
    return res.status(400).json({ message: 'isAvailable must be a boolean' });
  }

  try {
    // Update driver's availability status
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({
      message: 'Availability updated successfully',
      driver: updatedDriver,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating driver', error: err.message });
  }
};

// Get Upcoming Bookings for a Driver
const getUpcomingBookings = async (req, res) => {
  try {
    // Fetch bookings with status 'upcoming'
    const bookings = await Booking.find({ driverId: req.params.driverId, status: 'upcoming' });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  updateDriverAvailability,
  getUpcomingBookings,
};
