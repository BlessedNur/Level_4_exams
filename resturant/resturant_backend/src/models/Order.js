const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true, // Remove required: true since we'll generate it
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "completed", "cancelled"],
      default: "pending",
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["delivery", "takeaway", "dine-in"],
      required: true,
    },
    table: {
      type: Number,
      required: function () {
        return this.type === "dine-in";
      },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "paypal"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before validation
orderSchema.pre("validate", async function (next) {
  try {
    if (!this.orderNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      // Find the last order of today to generate the sequence
      const lastOrder = await this.constructor
        .findOne({
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        })
        .sort({ createdAt: -1 });

      const sequence = lastOrder
        ? parseInt(lastOrder.orderNumber.slice(-3)) + 1
        : 1;

      this.orderNumber = `${year}${month}${day}${sequence
        .toString()
        .padStart(3, "0")}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Order", orderSchema);
