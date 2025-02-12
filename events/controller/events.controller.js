const Event = require("../models/event.model");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving events" });
  }
};
const addEvent = async (req, res) => {
  try {
    const { name, date, location, description } = req.body;
    const event = new Event({ name, date, location, description });
    const existingEvent = await Event.findOne({ name, date });
    if (existingEvent) {
      return res
        .status(400)
        .json({ error: "Event with the same name and date already exists" });
    }

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event deleted successfully",
      deletedEvent: event,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event" });
  }
};

module.exports = {
  getEvents,
  addEvent,
  deleteEvent,
};
