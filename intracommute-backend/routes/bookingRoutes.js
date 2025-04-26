const express = require('express');
const { bookRide } = require("../controllers/bookingController");
const Booking = require('../models/Booking');  // Use require here for Booking model
const Driver = require('../models/Driver'); // Import Driver model

const router = express.Router();  // Initialize the router

// Book a ride
router.post("/BookRide", async (req, res) => {
    try {
      const { pickupLocation, dropoffLocation, userId, fare } = req.body;

      const driver = await Driver.findOne({ isAvailable: true }); // or however you're finding drivers
      if (!driver) return res.status(400).json({ message: 'No available driver' });
      console.log("Incoming booking:", req.body);
      console.log("Selected driver:", driver);

      const newBooking = new Booking({
        pickupLocation,
        dropoffLocation,
        fare,
        userId,
        driverId: driver._id, // ✅ fixed
        status: "Booked",
        pickupTime: new Date()
      });
      await newBooking.save();

      await Driver.findByIdAndUpdate(driver._id, { // ✅ fixed
        $inc: {
          todaysIncome: fare,
          monthlyIncome: fare,
          totalKmDriven: 10,
          totalSuccessfulRides: 1,
        },
        $set: { isAvailable: false }
      });

      driver.earnings += fare;
      await driver.save();

      // Sending the response with the correct driver data
      res.status(200).json({
        message: "Ride booked successfully",
        driver: {
          firstName: driver.firstName, // Use driver directly here
          lastName: driver.lastName,   // Use driver directly here
          phone: driver.phone,         // Use driver directly here
          vehicleType: driver.vehicleType, // Use driver directly here
          vehicleNumber: driver.vehicleNumber // Use driver directly here
        },
        rideDetails: {
          fare,
          pickupLocation,
          dropoffLocation,
        }
      });
    } catch (err) {
      console.error("Booking error:", err);
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
