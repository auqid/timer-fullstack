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
    const task = await Task.findById(taskId);
    if (!task || task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Task not found or not authorized" });
    }

    const existingLog = await TimeLog.findOne({ task: taskId, endTime: null });
    if (existingLog) {
      return res
        .status(400)
        .json({ error: "Timer is already running for this task." });
    }

    const timeLog = await TimeLog.create({
      task: taskId,
      user: req.user.id,
      startTime: new Date(),
    });

    await Task.findByIdAndUpdate(taskId, { $push: { timeLogs: timeLog._id } });
    res.status(201).json(timeLog);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// @desc    Stop tracking time
// @route   POST /api/timelogs/stop
// @access  Private
timeLogsRouter.post("/stop", async (req, res) => {
  try {
    const { taskId } = req.body;
    const timeLog = await TimeLog.findOne({
      task: taskId,
      user: req.user.id,
      endTime: null,
    });
    if (!timeLog) {
      return res
        .status(404)
        .json({ error: "No active timer found for this task." });
    }

    timeLog.endTime = new Date();
    await timeLog.save(); // pre-save hook calculates duration

    await Task.findOneAndUpdate(
      { _id: taskId, status: "Pending" },
      { status: "In Progress" }
    );
    res.status(200).json(timeLog);
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// @desc    Get daily summary
// @route   GET /api/timelogs/summary/today
// @access  Private
timeLogsRouter.get("/summary/today", async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysLogs = await TimeLog.find({
      user: req.user.id,
      startTime: { $gte: startOfToday, $lte: endOfToday },
    }).populate("task", "title");

    const totalTime = todaysLogs.reduce(
      (acc, log) => acc + (log.duration || 0),
      0
    );
    res.status(200).json({ totalTimeTracked: totalTime, logs: todaysLogs });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

module.exports = timeLogsRouter;
