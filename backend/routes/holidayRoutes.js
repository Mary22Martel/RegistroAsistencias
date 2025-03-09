const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { createHoliday, getHolidays, deleteHoliday } = require("../controllers/holidayController");

const router = express.Router();

router.post("/", protect, isAdmin, createHoliday);
router.get("/", protect, getHolidays);
router.delete("/:id", protect, isAdmin, deleteHoliday);

module.exports = router;