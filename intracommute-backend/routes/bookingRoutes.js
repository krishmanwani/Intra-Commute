const express = require('express');
const { bookRide } = require("../controllers/bookingController");
const Booking = require('../models/Booking');
const router = express.Router();

// Book a ride
router.post('/book', async (req, res) => {
    try {
        const { userId, pickup, destination, vehicleType } = req.body;
        const newBooking = new Booking({ userId, pickup, destination, vehicleType, status: "pending" });
        await newBooking.save();
        res.status(201).json({ msg: "Ride booked successfully", booking: newBooking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
