const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

const router = express.Router();

// Helper functions for validation
const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Route: User or Driver Registration (Signup)
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, role, phone, vehicleType, vehicleNumber } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: 'All required fields must be filled' });
  }

  // Validate password match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    // Check if the email already exists
    let existingUser;
    if (role === 'Driver') {
      existingUser = await Driver.findOne({ email });
    } else {
      existingUser = await User.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ msg: 'User or Driver already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    };

    if (role === 'Driver') {
      newUser.phone = phone;
      newUser.vehicleType = vehicleType;
      newUser.vehicleNumber = vehicleNumber;
    }

    let savedUser;
    if (role === 'Driver') {
      savedUser = new Driver(newUser);
    } else {
      savedUser = new User(newUser);
    }

    await savedUser.save();
    res.status(201).json({ msg: 'User or Driver registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// ✅ Register the signup route
router.post('/signup', registerUser);

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role.toLowerCase() === 'driver') {
      user = await Driver.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: 'User or Driver not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = router;
