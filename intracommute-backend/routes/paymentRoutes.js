const express = require("express");
const { processPayment } = require("../controllers/paymentController");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/pay", async (req, res) => {
  const { amount } = req.body;

  try {
    const payment = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Payment error" });
  }
});

module.exports = router;
