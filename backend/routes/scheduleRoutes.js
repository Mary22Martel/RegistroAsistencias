const express = require("express");
const { assignSchedule, getEmployeeSchedules } = require("../controllers/scheduleController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Asignar horario (solo admin)
router.post("/assign", protect, isAdmin, assignSchedule);

// Obtener horarios de un empleado
router.get("/employee/:employeeId", protect, getEmployeeSchedules);

module.exports = router;