const Vehicle = require("../models/Vehicle");

// Get Available Vehicles
const getAvailableVehicles = async (req, res) => {
    try {
        const availableVehicles = await Vehicle.find({ isAvailable: true });
        res.json(availableVehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAvailableVehicles };
