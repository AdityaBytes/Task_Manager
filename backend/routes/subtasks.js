// routes/subTasks.js
const express = require("express");
const router = express.Router();
const SubTask = require("../models/SubTask");
const Task = require("../models/Task"); // Import the Task model
const authMiddleware = require("../middleware/authMiddleware");

// Create a new sub-task
router.post("/", authMiddleware, async (req, res) => {
  const { taskId, title } = req.body;
  try {
    // Create and save the new subtask
    const subTask = new SubTask({ taskId, title });
    await subTask.save();

    // Update the parent Task document to include this subtask
    await Task.findByIdAndUpdate(
      taskId,
      { $push: { subTasks: subTask._id } },
      { new: true }
    );

    res.status(201).json(subTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sub-task" });
  }
});

// Mark sub-task as completed/pending
router.put("/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const subTask = await SubTask.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sub-task" });
  }
});



module.exports = router;
