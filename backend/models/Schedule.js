const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["completo", "medio tiempo"],
    default: "completo",
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);