const Schedule = require("../models/Schedule");
const User = require("../models/User");

// Asignar un nuevo horario
const assignSchedule = async (req, res) => {
  const { employeeId, startTime, endTime, date, type } = req.body;

  try {
    // Verificar si el empleado existe
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Crear el horario
    const schedule = await Schedule.create({
      employeeId,
      startTime,
      endTime,
      date,
      type,
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error al asignar el horario" });
  }
};

// Obtener horarios de un empleado
const getEmployeeSchedules = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const schedules = await Schedule.find({ employeeId });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los horarios" });
  }
};

module.exports = { assignSchedule, getEmployeeSchedules };