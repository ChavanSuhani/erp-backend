const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const { verifyToken, getProfile } = require("../controllers/authController");

router.get("/profile", verifyToken, getProfile);


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      username,
      email,
      password: hashed,
      role,
    });

    await user.save();

    res.json({ message: "User registered" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    // 1. Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Send response (ONLY ONCE)
    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
