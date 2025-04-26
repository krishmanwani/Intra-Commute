// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "Completed"],
    default: "Booked",
  },
  // New: User who booked the ride
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },

  // Optional: Fare for the ride
  fare: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Booking", bookingSchema);



