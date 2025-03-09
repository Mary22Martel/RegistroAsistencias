const express = require("express");
const multer = require("multer");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { assignSchedule, getEmployeeSchedule, getAllSchedules, processScheduleExcel } = require("../controllers/scheduleController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Definir rutas correctamente
router.post("/", protect, isAdmin, assignSchedule);
router.get("/", protect, isAdmin, getAllSchedules);
router.get("/employee", protect, getEmployeeSchedule);
router.post("/upload", protect, isAdmin, upload.single("excel"), processScheduleExcel); // ✅ Corregido

module.exports = router;
