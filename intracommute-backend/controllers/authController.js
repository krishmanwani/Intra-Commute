const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver'); // Import the Driver model

// User or Driver Registration (Signup)
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, vehicleType, vehicleNumber, phone } = req.body;

  try {
    // Check if the driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) return res.status(400).json({ message: 'Driver already exists' });

    // Hash the password for the driver
    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = new Driver({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      phone, 
      vehicleType, 
      vehicleNumber 
    });

    await driver.save();

    res.status(201).json({
      message: 'Driver registered successfully',
      driver: {
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        role: driver.role, // "Driver" role is automatically assigned in the schema
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Driver or User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user is a driver by default based on email (or use some other condition to differentiate)
    let user;
    if (email.includes('@driver.com')) { // Example, customize as needed to distinguish drivers
      user = await Driver.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Driver not found' });
    } else {
      user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = { registerUser, loginUser };
