const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const taskRouter = require("./controllers/tasks");
const timelogRouter = require("./controllers/timelog");
const loginRouter = require("./controllers/users");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      config.FRONTEND_URL,
      "https://your-app-name.vercel.app",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(middleware.requestLogger);

app.get("/", (req, res) => {
  res.json({
    message: "TaskTimer API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/login",
      tasks: "/api/tasks",
      timelogs: "/api/timelogs",
    },
  });
});
app.use("/api/tasks", taskRouter);
app.use("/api/timelogs", timelogRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
