const express = require("express");
const router = express.Router();
const {
  addMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateMenuItemStatus,
  getFeaturedItems,
} = require("../controller/menu.controller");

router.get("/", getMenuItems);

router.post("/", addMenuItem);

// router.get("/category/:category", getMenuItems);

// router.get("/:id", getMenuItem);

router.put("/:id", updateMenuItem);

router.delete("/:id", deleteMenuItem);

router.patch("/:id/status", updateMenuItemStatus);

module.exports = router;
