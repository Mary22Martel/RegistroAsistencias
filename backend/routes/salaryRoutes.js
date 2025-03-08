const express = require("express");
const { calculateSalary } = require("../controllers/salaryController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { generatePDFReport, generateExcelReport } = require("../controllers/reportController");

const router = express.Router();

// Calcular sueldo (solo admin)
router.post("/calculate", protect, isAdmin, calculateSalary);
// Generar reporte PDF (solo admin)
router.post("/generate-pdf", protect, isAdmin, generatePDFReport);

// Generar reporte Excel (solo admin)
router.post("/generate-excel", protect, isAdmin, generateExcelReport);

module.exports = router;
