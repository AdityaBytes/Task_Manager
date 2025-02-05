const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  try {
    const task = new Task({
      userId: req.user.userId,
      title,
      description,
      dueDate,
      priority,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get all tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).populate("subTasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


module.exports = router;