const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { createJustification, getMyJustifications, getAllJustifications, updateJustificationStatus } = require("../controllers/justificationController");

const router = express.Router();

router.post("/", protect, createJustification);
router.get("/my", protect, getMyJustifications);
router.get("/", protect, isAdmin, getAllJustifications);
router.put("/:id", protect, isAdmin, updateJustificationStatus);

module.exports = router;