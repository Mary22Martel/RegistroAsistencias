const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["presente", "ausente", "tardanza"],
    default: "presente",
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);