const tasksRouter = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const TimeLog = require("../models/timelog");
const { protect } = require("../utils/middleware");

tasksRouter.use(protect);

// @desc    Get all tasks for user & Create a new task
// @route   GET & POST /api/tasks
// @access  Private
tasksRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.id }).populate(
        "timeLogs",
        "duration"
      );
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { userInput, title, description } = req.body;
      if (!userInput && !title) {
        return res
          .status(400)
          .json({ error: "Task input or title is required." });
      }

      const finalTitle = title || userInput;
      const finalDescription = description || "";

      const task = await Task.create({
        user: req.user.id,
        userInput: userInput || "",
        title: finalTitle,
        description: finalDescription,
      });

      await User.findByIdAndUpdate(req.user.id, { $push: { tasks: task._id } });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  });

// @desc    Update, Delete a specific task
// @route   PUT, DELETE /api/tasks/:id
// @access  Private
tasksRouter
  .route("/:id")
  .put(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      if (task.user.toString() !== req.user.id)
        return res.status(401).json({ error: "Not authorized" });

      const { title, description, status } = req.body;
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;

      const updatedTask = await task.save();
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      if (task.user.toString() !== req.user.id)
        return res.status(401).json({ error: "Not authorized" });

      await TimeLog.deleteMany({ task: req.params.id });
      await Task.findByIdAndDelete(req.params.id);
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { tasks: req.params.id },
      });

      res.status(200).json({ message: "Task removed" });
    } catch (error) {
      res.status(500).json({ error: "Server Error", details: error.message });
    }
  });

module.exports = tasksRouter;
