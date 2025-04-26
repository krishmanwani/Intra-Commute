const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes'); // Your auth routes file
const bookingRoutes = require("./routes/bookingRoutes"); // Import booking routes
const rideRoutes = require("./routes/rideRoutes"); // Import ride routes
const Booking = require('./models/Booking');   // Assuming you have a Booking model
const Driver = require("./models/Driver");    // Assuming you have a Driver model
const User = require("./models/User");        // Assuming you have a User model
const driverDashboardController = require("./controllers/driverDashboardController");

const router = express.Router();

// Load environment variables (if you want to keep future flexibility)
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Enable CORS for frontend

const PORT = process.env.PORT || 6001;

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/intracommuteDB", {  // Using the direct connection string
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Locally"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Intracommute Backend is Running!");
});

// API Routes
app.use("/api/bookings", bookingRoutes); // Booking routes
app.use("/api/rides", rideRoutes); // Ride routes
// Register auth routes once
app.use("/api/auth", authRoutes);
app.get("/api/driver-dashboard/:driverId", driverDashboardController.getDriverDashboardData);



// Start server
const server = app.listen(PORT, () => {
  console.log(`🚗 Server running on port ${PORT}`);
});

// Error handler
server.on("error", (err) => {
  console.error("❌ Server Error:", err);
});

// In your booking routes (server-side)

// Booking route to handle booking requests
router.post("/BookRide", async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, userId, fare } = req.body;

    // Find available driver (for simplicity, you can use a random available driver)
    const availableDrivers = await Driver.find({ isAvailable: true });
    console.log("Available Drivers:", availableDrivers); // Check if any drivers are available


    if (!availableDrivers) {
      return res.status(400).json({ message: "No available drivers." });
    }

    // Create new booking with driver assigned
    const newBooking = new Booking({
      pickupLocation,
      dropoffLocation,
      fare,
      userId,
      driverId: availableDrivers._id,
      status: "Booked",
    });

    // Save the booking
    await newBooking.save();

    // Update driver's dashboard data (e.g., increment income)
    await Driver.findByIdAndUpdate(availableDriver._id, {
      $inc: {
        todaysIncome: fare,
        monthlyIncome: fare,
        totalKmDriven: 10,  // Assuming fixed distance for simplicity
        totalSuccessfulRides: 1,
      },
    });

    // Return success response with the driver info and fare
    res.status(200).json({
      message: "Ride booked successfully",
      driver: {
        name: availableDriver.name,
        phone: availableDriver.phone,
      },
      rideDetails: {
        fare,
        pickupLocation,
        dropoffLocation,
      },
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Error booking ride." });
  }
});


module.exports = router;
