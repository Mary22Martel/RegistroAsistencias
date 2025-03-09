const Attendance = require("../models/Attendance");
const Schedule = require("../models/Schedule");
const Holiday = require("../models/Holiday");
const User = require("../models/User");
const exceljs = require("exceljs");

// ✅ Procesar archivo Excel de asistencias (solo admin)
const processAttendanceExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.getWorksheet(1);
    const attendances = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const email = row.getCell(1).value;
      const date = row.getCell(2).value;
      const entryTime = row.getCell(3).value;
      const exitTime = row.getCell(4).value;

      // Obtener usuario por email
      const user = await User.findOne({ email });

      if (user) {
        // Calcular horas trabajadas
        const [entryHour, entryMinute] = entryTime.split(":").map(Number);
        const [exitHour, exitMinute] = exitTime.split(":").map(Number);
        const totalMinutes = (exitHour * 60 + exitMinute) - (entryHour * 60 + entryMinute);
        const hoursWorked = Math.round((totalMinutes / 60) * 100) / 100;

        // Verificar si ya existe asistencia
        const existingAttendance = await Attendance.findOne({
          userId: user._id,
          date: new Date(date),
        });

        if (existingAttendance) {
          existingAttendance.entryTime = entryTime;
          existingAttendance.exitTime = exitTime;
          existingAttendance.hoursWorked = hoursWorked;
          existingAttendance.status = "presente";
          await existingAttendance.save();
          attendances.push(existingAttendance);
        } else {
          const newAttendance = await Attendance.create({
            userId: user._id,
            date: new Date(date),
            entryTime,
            exitTime,
            hoursWorked,
            status: "presente",
          });
          attendances.push(newAttendance);
        }
      }
    }

    res.status(200).json({
      message: "Datos de asistencia procesados correctamente",
      count: attendances.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el archivo de asistencias", error: error.message });
  }
};

// ✅ Obtener asistencias de un empleado por mes y año
const getEmployeeAttendances = async (req, res) => {
  const { month, year } = req.query;

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await Attendance.find({
      userId: req.params.id || req.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener asistencias", error: error.message });
  }
};

// ✅ Obtener el estado de asistencia del empleado autenticado
const getEmployeeAttendanceStatus = async (req, res) => {
  const { month, year } = req.query;

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await Attendance.find({
      userId: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).select("date status hoursWorked");

    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el estado de asistencia", error: error.message });
  }
};

// ✅ Exportar todas las funciones correctamente
module.exports = {
  processAttendanceExcel,
  getEmployeeAttendances,
  getEmployeeAttendanceStatus,
};
