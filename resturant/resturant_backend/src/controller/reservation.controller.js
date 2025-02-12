const Reservation = require("../models/Reservation");

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1, time: 1 });
    res.status(200).json(reservations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reservations", error: error.message });
  }
};

// Create new reservation
exports.createReservation = async (req, res) => {
  try {
    // Check for table availability
    const existingReservation = await Reservation.findOne({
      date: new Date(req.body.date),
      time: req.body.time,
      tableNumber: req.body.tableNumber,
      status: { $ne: "cancelled" },
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "Table is already reserved for this time slot",
      });
    }

    const reservation = new Reservation(req.body);
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating reservation", error: error.message });
  }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating reservation", error: error.message });
  }
};


// Delete reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting reservation", error: error.message });
  }
};

exports.getAvailableTables = async (req, res) => {
  try {
    const { date, time } = req.query;
    const reservedTables = await Reservation.find({
      date: new Date(date),
      time: time,
      status: { $ne: "cancelled" },
    }).select("tableNumber");

    const allTables = Array.from({ length: 20 }, (_, i) => i + 1); // Assuming 20 tables
    const availableTables = allTables.filter(
      (table) => !reservedTables.some((r) => r.tableNumber === table)
    );

    res.status(200).json(availableTables);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error checking table availability",
        error: error.message,
      });
  }
};
