const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email ||!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email, and password",
    });
  }

  next();
};
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, "my_secret");
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { validateUser, protect };
