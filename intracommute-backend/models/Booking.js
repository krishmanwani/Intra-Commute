const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    pickup: String,
    destination: String,
    vehicleType: String,
    status: { type: String, default: "pending" }
});

module.exports = mongoose.model('Booking', BookingSchema);
