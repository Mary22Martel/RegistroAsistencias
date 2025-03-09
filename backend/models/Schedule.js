const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduleType: { type: String, enum: ["completo", "medio"], required: true },
  startMorning: { type: String, required: true },
  endMorning: { type: String, required: true },
  startAfternoon: { type: String },
  endAfternoon: { type: String },
  baseSalary: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
