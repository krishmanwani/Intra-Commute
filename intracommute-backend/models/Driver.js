const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: 'Driver',
      enum: ['Driver'],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    phone: {
      type: String,
      required: function () { return this.role === 'Driver'; },
      match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    vehicleType: {
      type: String,
      required: function () { return this.role === 'Driver'; },
    },
    vehicleNumber: {
      type: String,
      required: function () { return this.role === 'Driver'; },
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
