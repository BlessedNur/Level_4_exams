// dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const app = express();
const cors = require("cors");

const menuRoutes = require("./src/routes/menu.routes");
const reservationRoutes = require("./src/routes/reservation.routes");
const orderRoutes = require("./src/routes/order.routes");
const staffRoutes = require("./src/routes/staff.routes");
const authRoutes = require("./src/routes/auth.routes");
app.use(express.json());

mongoose
  .connect("mongodb://localhost/resturant_app")
  .then(() => {
    app.use(cors());
    // routes
    app.use("/api/menu", menuRoutes);
    app.use("/api", reservationRoutes);
    app.use("/api", orderRoutes);
    app.use("/api", staffRoutes);
    app.use("/api/auth", authRoutes);
    console.log("MongoDB Connected...");
  })
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
