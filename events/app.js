const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./routes/events.route");

const app = express();
app.use(express.json());
// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/event-management")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
