const express = require("express");
const { login, getMe, logout } = require("../controller/auth.controller");
const { protect, validateUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", validateUser, login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);

module.exports = router;
