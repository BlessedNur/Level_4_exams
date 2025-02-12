// userModel.js
const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["staff", "owner"],
    default: "staff",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
