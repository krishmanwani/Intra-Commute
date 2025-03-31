const Ride = require("../models/Ride");

// Book a Ride
const bookRide = async (req, res) => {
  const { userId, pickup, destination, fare } = req.body;

  try {
    const ride = new Ride({ userId, pickup, destination, fare });
    await ride.save();
    res.status(201).json({ message: "Ride booked successfully", ride });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Fetch All Available Rides
const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "pending" });
    res.status(200).json(rides);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { bookRide, getAvailableRides };

