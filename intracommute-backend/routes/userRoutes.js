const Booking = require("../models/Booking"); // make sure Booking model exists

router.get("/driver/:id", async (req, res) => {
    try {
        const driver = await User.findById(req.params.id);
        const bookings = await Booking.find({ driver: req.params.id }).populate("user");

        res.json({ driver, bookings });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch driver info" });
    }
});
