// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed (e.g., profile picture, bio, etc.)
});

const User = mongoose.model("User", userSchema);

module.exports = User;
