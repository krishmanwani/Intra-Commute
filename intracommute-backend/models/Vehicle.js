const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    type: String,
    isAvailable: Boolean
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
