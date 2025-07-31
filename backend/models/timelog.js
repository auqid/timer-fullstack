const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeLogSchema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // Storing duration in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate duration before saving
timeLogSchema.pre("save", function (next) {
  if (this.endTime && this.startTime) {
    const durationInSeconds = Math.round(
      (this.endTime.getTime() - this.startTime.getTime()) / 1000
    );
    this.duration = durationInSeconds;
  }
  next();
});

const TimeLog = mongoose.model("TimeLog", timeLogSchema);

module.exports = TimeLog;
