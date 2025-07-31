const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    timeLogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "TimeLog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
