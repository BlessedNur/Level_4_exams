const Staff = require("../models/Staff");

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Staff member not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    res.status(201).json({
      status: "success",
      data: newStaff,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body);

    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    if (!staff) {
      return res.status(404).json({
        status: "error",
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
