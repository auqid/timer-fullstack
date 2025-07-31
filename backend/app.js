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
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/tasks", taskRouter);
app.use("/api/timelogs", timelogRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
