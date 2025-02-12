const validateEventData = (req, res, next) => {
  const { name, date, location, description } = req.body;

  if (!name || !date || !location || !description) {
    return res.status(400).json({
      error: "All fields are required: name, date, location, description",
    });
  }

  if (!Date.parse(date)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  next();
};

module.exports = validateEventData;
