const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const PORT = process.env.PORT || 6001;

// ✅ Corrected MongoDB connection (no duplicate import)
mongoose
  .connect("mongodb://127.0.0.1:27017/intracommuteDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Locally"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Basic API route
app.get("/", (req, res) => {
  res.send(" Intracommute Backend is Running!");
});

// ✅ Corrected route order (better practice)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));

// Start the server
const server = app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

// Handle server errors
server.on("error", (err) => {
  console.error(" Server Error:", err);
});


