const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET students of the logged-in teacher
router.get("/my-students", async (req, res) => {
  try {
    const students = await User.find({ teacherId: req.user._id });
    res.json(students);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

