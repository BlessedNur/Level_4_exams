const express = require("express");
const router = express.Router();
const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  updateStatus,
} = require("../controller/staff.controller");

router.get("/staff", getAllStaff);
router.get("/staff/:id", getStaff);
router.post("/staff", createStaff);
router.put("/staff/:id", updateStaff); // Changed from route() to put()
router.delete("/staff/:id", deleteStaff);
router.patch("/staff/:id/status", updateStatus);

module.exports = router;
