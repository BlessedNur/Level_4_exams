const express = require("express");
const router = express.Router();
const eventController = require("../controller/events.controller");
const validateEventData = require("../middleware/events.middleware");

router.get("/", eventController.getEvents);

router.post("/", validateEventData, eventController.addEvent);

router.delete("/:id", eventController.deleteEvent);

module.exports = router;
