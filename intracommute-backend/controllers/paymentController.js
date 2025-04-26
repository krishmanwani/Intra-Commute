const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Process Payment
const processPayment = async (req, res) => {
  const { amount } = req.body;

  try {
    const payment = await razorpay.orders.create({
      amount: amount * 100, // Razorpay requires the amount in paise (100 paise = 1 INR)
      currency: "INR",
      payment_capture: 1,
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Payment error", details: error.message });
  }
};

module.exports = { processPayment };
