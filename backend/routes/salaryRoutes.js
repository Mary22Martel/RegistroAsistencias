const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { calculateSalary, generatePdfReport, generateExcelReport } = require("../controllers/salaryController");

const router = express.Router();

router.post("/calculate", protect, isAdmin, calculateSalary);
router.get("/report/pdf", protect, isAdmin, generatePdfReport);
router.get("/report/excel", protect, isAdmin, generateExcelReport);
router.get("/my", protect, async (req, res) => {
  const { month, year } = req.query;
  
  try {
    const salary = await Salary.findOne({ 
      userId: req.user.id,
      month,
      year
    });
    
    if (!salary) {
      return res.status(404).json({ message: "Sueldo no encontrado" });
    }
    
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener sueldo", error: error.message });
  }
});

module.exports = router;