const User = require("../models/User");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
const generateToken = (id) => {
  return jwt.sign({ id }, "my_secret", {
    expiresIn: "1h",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(402).json({
        success: false,
        message: "Invalid credentialss",
      });
    }

    // const isMatch = await matchPassword(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid password credentials",
    //   });
    // }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Invalid role for this user",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {},
  });
};
