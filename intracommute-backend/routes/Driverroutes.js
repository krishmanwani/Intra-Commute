const express = require('express');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const router = express.Router();

// Update Driver Availability
router.put('/update/:id', async (req, res) => {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
        return res.status(400).json({ message: 'isAvailable must be a boolean' });
    }

    try {
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
});

// Get Upcoming Bookings for a Driver
router.get('/bookings/upcoming/:driverId', async (req, res) => {
    try {
        const bookings = await Booking.find({ driverId: req.params.driverId, status: 'upcoming' });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookings', error: err.message });
    }
});

module.exports = router;
