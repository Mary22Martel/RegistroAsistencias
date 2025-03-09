const mongoose = require("mongoose");

const justificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  entryTime: { type: String },
  exitTime: { type: String },
  hoursWorked: { type: Number },
  message: { type: String, required: true },
  photoUrl: { type: String },
  status: { type: String, enum: ["pendiente", "aprobado", "rechazado"], default: "pendiente" },
  shift: { type: String, enum: ["mañana", "tarde", ""] }, // ✅ Nuevo campo para tardanza
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Justification", justificationSchema);
