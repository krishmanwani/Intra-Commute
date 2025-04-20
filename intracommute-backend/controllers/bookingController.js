const Booking = require("../models/Booking");

const bookRide = async (req, res) => {
    try {
        const { userId, pickup, destination, vehicleType } = req.body;

        const newBooking = new Booking({
            userId,
            pickup,
            destination,
            vehicleType,
            status: "pending"
        });

        await newBooking.save();

        res.status(201).json({ msg: "Ride booked successfully", booking: newBooking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { bookRide };
