const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  processAttendanceExcel,
  getEmployeeAttendances,
  getEmployeeAttendanceStatus,
} = require("../controllers/attendanceController");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// ✅ Subir archivo de asistencias (solo admin)
router.post("/upload", protect, isAdmin, upload.single("excel"), processAttendanceExcel);

// ✅ Obtener asistencias de un empleado (por mes y año)
router.get("/employee/:id?", protect, getEmployeeAttendances);

// ✅ Obtener estado de asistencia del usuario autenticado
router.get("/my-status", protect, getEmployeeAttendanceStatus);

module.exports = router;
