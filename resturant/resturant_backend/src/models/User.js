// userModel.js
const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["customer", "staff", "owner"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
