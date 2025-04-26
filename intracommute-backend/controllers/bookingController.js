const Booking = require("../models/Booking");
const Driver = require("../models/Driver"); // ✅ Import Driver model

const bookRide = async (req, res) => {
    try {
        const { userId, pickup, destination, vehicleType } = req.body;

        // ✅ Step 1: Find an available driver matching vehicle type
        const assignedDriver = await Driver.findOne({ isAvailable: true, vehicleType });

        if (!assignedDriver) {
            return res.status(404).json({ msg: "No available drivers for selected vehicle type." });
        }

        // ✅ Step 2: Create booking with driver assigned
        const newBooking = new Booking({
            userId,
            pickup,
            destination,
            vehicleType,
            driverId: assignedDriver._id, // ✅ Set driver
            status: "pending"
        });

        await newBooking.save();

        // ✅ Step 4: Send success response with full driver details
        res.status(201).json({
            msg: "Ride booked successfully",
            booking: newBooking,
            driver: {
                firstName: assignedDriver.firstName,
                lastName: assignedDriver.lastName,
                phone: assignedDriver.phone,
                vehicleType: assignedDriver.vehicleType,
                vehicleNumber: assignedDriver.vehicleNumber
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { bookRide };
