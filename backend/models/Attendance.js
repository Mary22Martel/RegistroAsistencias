const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  entryTime: { type: String },
  exitTime: { type: String },
  hoursWorked: { type: Number },
  status: { type: String, enum: ["presente", "ausente", "tardanza"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
