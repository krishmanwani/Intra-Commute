const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, // Trims leading/trailing spaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true, // Trims leading/trailing spaces
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true, // Convert email to lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensure password is at least 6 characters long
  },
  role: {
    type: String,
    enum: ["User", "Driver"],
    default: "User",
  },
}, { timestamps: true }); // Added timestamps for createdAt and updatedAt

module.exports = mongoose.model("User", userSchema);


