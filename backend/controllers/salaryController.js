const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Holiday = require("../models/Holiday");

const calculateSalary = async (req, res) => {
  const { employeeId, month, year } = req.body;

  try {
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Obtener asistencias del empleado en el mes y año especificados
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Obtener días festivos en el mes y año especificados
    const holidays = await Holiday.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Calcular sueldo neto
    const dailySalary = employee.salary / 30; // Suponiendo 30 días al mes
    let totalSalary = employee.salary;

    attendances.forEach((attendance) => {
      if (attendance.status === "ausente") {
        totalSalary -= dailySalary;
      } else if (attendance.status === "tardanza") {
        totalSalary -= dailySalary * 0.5; // Descuento del 50% por tardanza
      }
    });

    // No aplicar descuentos en días festivos
    holidays.forEach((holiday) => {
      const holidayAttendance = attendances.find(
        (att) => att.date.toDateString() === holiday.date.toDateString()
      );
      if (holidayAttendance && holidayAttendance.status === "ausente") {
        totalSalary += dailySalary; // Revertir descuento por ausencia en día festivo
      }
    });

    res.status(200).json({
      employeeId,
      month,
      year,
      grossSalary: employee.salary,
      netSalary: totalSalary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al calcular el sueldo" });
  }
};

module.exports = { calculateSalary };