const express = require('express');
const { getAvailableVehicles } = require("../controllers/vehicleController");
const Vehicle = require('../models/Vehicle');
const router = express.Router();

// Get available vehicles
router.get('/available', async (req, res) => {
    try {
        const availableVehicles = await Vehicle.find({ isAvailable: true });
        res.json(availableVehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
