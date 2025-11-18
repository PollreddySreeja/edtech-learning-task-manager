const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// ---------------------------------------------------
// CREATE TASK
// ---------------------------------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate, userId } = req.body;

    const ownerId = userId || req.user._id;

    const task = new Task({
      title,
      description,
      status,
      dueDate,
      user: ownerId,
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// ---------------------------------------------------
// GET TASKS  (UPDATED FULL VERSION)
// ---------------------------------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { teacherView, status } = req.query;

    // -----------------------------
    // TEACHER: See all student tasks
    // -----------------------------
    if (teacherView === "true" && req.user.role === "teacher") {
      const students = await User.find({ teacherId: req.user._id }).select(
        "_id email"
      );

      const studentIds = students.map((s) => s._id);

      const filter = { user: { $in: studentIds } };
      if (status && status !== "all") filter.status = status;

      const studentTasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .populate("user", "email");

      return res.json(studentTasks);
    }

    // -----------------------------
    // STUDENT: See own tasks
    // -----------------------------
    const filter = { user: req.user._id };
    if (status && status !== "all") filter.status = status;

    const userTasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "email");

    res.json(userTasks);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// ---------------------------------------------------
// UPDATE TASK
// ---------------------------------------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, dueDate },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// ---------------------------------------------------
// DELETE TASK
// ---------------------------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
