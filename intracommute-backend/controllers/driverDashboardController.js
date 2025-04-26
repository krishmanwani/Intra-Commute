// src/controllers/driverDashboardController.js
const Ride = require("../models/Ride");
const User = require("../models/User");
const Driver = require("../models/Driver");

const getDriverDashboardData = async (req, res) => {
  const { driverId } = req.params;

  try {
    const user = await User.findById(driverId);
    if (!user || user.role.toLowerCase() !== "driver") {
      return res.status(400).json({ msg: "Invalid driver" });
    }
    

    const rides = await Ride.find({ driverId });

    const monthlyIncome = rides.reduce((acc, ride) => {
      const rideMonth = new Date(ride.createdAt).getMonth();
      if (rideMonth === new Date().getMonth()) {
        acc += ride.fare;
      }
      return acc;
    }, 0);

    const currentRide = rides.find(ride => ride.status === "pending");
    const totalSuccessfulRides = rides.filter(ride => ride.status === "completed").length;
    const canceledRides = rides.filter(ride => ride.status === "canceled").length;

    const rating = user.rating || 4.5; // Default rating if not available
    const todaysIncome = rides
      .filter(ride => new Date(ride.createdAt).toDateString() === new Date().toDateString())
      .reduce((acc, ride) => acc + ride.fare, 0);

    const totalKmDriven = rides.reduce((acc, ride) => acc + ride.distance, 0);

    res.json({
      monthlyIncome,
      currentRide,
      rating,
      totalSuccessfulRides,
      canceledRides,
      todaysIncome,
      totalKmDriven,
      driverProfile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
        joinedDate: user.createdAt,
      },
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching dashboard data" });
  }
};

module.exports = { getDriverDashboardData };