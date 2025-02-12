const express = require("express");
const router = express.Router();
const reservationController = require("../controller/reservation.controller");

router.get("/reservations", reservationController.getAllReservations);

router.post("/reservations", reservationController.createReservation);

router.patch(
  "/reservations/:id/status",
  reservationController.updateReservationStatus
);

router.delete("/reservations/:id", reservationController.deleteReservation);

router.get("/available-tables", reservationController.getAvailableTables);

module.exports = router;
