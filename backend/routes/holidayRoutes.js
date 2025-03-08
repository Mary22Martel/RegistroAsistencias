const express = require("express");
const { addHoliday, getHolidays } = require("../controllers/holidayController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Agregar día festivo (solo admin)
router.post("/", protect, isAdmin, addHoliday);

// Obtener días festivos
router.get("/", protect, getHolidays);

module.exports = router;