const timeLogsRouter = require("express").Router();
const TimeLog = require("../models/timelog");
const Task = require("../models/task");
const { protect } = require("../utils/middleware");

timeLogsRouter.use(protect);

// @desc    Start tracking time
// @route   POST /api/timelogs/start
// @access  Private
timeLogsRouter.post("/start", async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Task not found or not authorized" });
    }

    // Check if there's already a running timer for this task
    const existingTimer = await TimeLog.findOne({
      task: taskId,
      user: req.user.id,
      endTime: null,
    });

    if (existingTimer) {
      return res
        .status(400)
        .json({ error: "Timer is already running for this task" });
    }

    // Check if there's any running timer for this user
    const anyRunningTimer = await TimeLog.findOne({
      user: req.user.id,
      endTime: null,
    });

    if (anyRunningTimer) {
      return res
        .status(400)
        .json({
          error: "Please stop the current timer before starting a new one",
        });
    }

    const timeLog = await TimeLog.create({
      task: taskId,
      user: req.user.id,
      startTime: new Date(),
    });

    // Add timelog to task's timeLogs array
    await Task.findByIdAndUpdate(taskId, {
      $push: { timeLogs: timeLog._id },
      $set: { status: "In Progress" },
    });

    console.log("Timer started:", timeLog); // Debug log
    res.status(201).json(timeLog);
  } catch (error) {
    console.error("Start timer error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// @desc    Stop tracking time
// @route   POST /api/timelogs/stop
// @access  Private
timeLogsRouter.post("/stop", async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Task not found or not authorized" });
    }

    const timeLog = await TimeLog.findOne({
      task: taskId,
      user: req.user.id,
      endTime: null,
    });

    if (!timeLog) {
      return res
        .status(400)
        .json({ error: "No active timer found for this task" });
    }

    timeLog.endTime = new Date();
    await timeLog.save(); // This will trigger the pre-save hook to calculate duration

    console.log("Timer stopped:", timeLog); // Debug log
    res.status(200).json(timeLog);
  } catch (error) {
    console.error("Stop timer error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// @desc    Get today's summary
// @route   GET /api/timelogs/summary/today
// @access  Private
timeLogsRouter.get("/summary/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeLogs = await TimeLog.find({
      user: req.user.id,
      startTime: { $gte: today, $lt: tomorrow },
      endTime: { $ne: null },
    }).populate("task", "title");

    const totalDuration = timeLogs.reduce(
      (acc, log) => acc + (log.duration || 0),
      0
    );
    const tasksWorkedOn = [
      ...new Set(timeLogs.map((log) => log.task._id.toString())),
    ].length;

    res.status(200).json({
      totalDuration,
      tasksWorkedOn,
      timeLogs,
    });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = timeLogsRouter;
