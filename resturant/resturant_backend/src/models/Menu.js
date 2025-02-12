const { Schema, mongoose } = require("mongoose");

const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Appetizers", "Main Course", "Desserts", "Beverages", "Sides"],
    },
    image: {
      type: String,
      required: true,
    },
    dietary: {
      type: [String],
      enum: ["V", "VG", "GF", "DF", "N"],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "sold_out"],
      default: "available",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
