const Justification = require("../models/Justification");
const Attendance = require("../models/Attendance");

// Crear justificación (empleado)
const createJustification = async (req, res) => {
  const { date, entryTime, exitTime, hoursWorked, message, photoUrl } = req.body;

  try {
    if (!message || !date) {
      return res.status(400).json({ message: "La fecha y el mensaje son obligatorios" });
    }

    // Creamos la justificación sin depender de la asistencia
    const justification = await Justification.create({
      userId: req.user.id,
      date,
      entryTime: entryTime || null, // Permite nulo
      exitTime: exitTime || null,
      hoursWorked: hoursWorked || 0, // Si no hay horas, inicializa en 0
      message,
      photoUrl,
      status: "pendiente",
    });

    res.status(201).json(justification);
  } catch (error) {
    console.error("❌ Error en createJustification:", error);
    res.status(500).json({ message: "Error al crear justificación", error: error.message });
  }
};


// Obtener justificaciones del empleado logueado
const getMyJustifications = async (req, res) => {
  try {
    const justifications = await Justification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(justifications);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener justificaciones", error: error.message });
  }
};

// Obtener todas las justificaciones (admin)
const getAllJustifications = async (req, res) => {
  try {
    const justifications = await Justification.find()
      .populate("userId", "name email")
      .sort({ status: 1, createdAt: -1 });
    
    res.status(200).json(justifications);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener justificaciones", error: error.message });
  }
};

// Aprobar o rechazar justificación (admin)
const updateJustificationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const justification = await Justification.findById(req.params.id);

    if (!justification) {
      return res.status(404).json({ message: "Justificación no encontrada" });
    }

    justification.status = status;
    await justification.save();

    // Si la justificación es aprobada, actualizar la asistencia
    if (status === "aprobado") {
      let attendance = await Attendance.findOne({
        userId: justification.userId,
        date: justification.date,
      });

      if (attendance) {
        // Si ya existe asistencia, solo corregimos los datos
        attendance.entryTime = justification.entryTime || attendance.entryTime;
        attendance.exitTime = justification.exitTime || attendance.exitTime;
        attendance.hoursWorked = justification.hoursWorked || attendance.hoursWorked;
        attendance.status = "presente"; // Se considera presente con la justificación aprobada
        await attendance.save();
      } else {
        // Si no hay asistencia, creamos una con los datos de la justificación
        await Attendance.create({
          userId: justification.userId,
          date: justification.date,
          entryTime: justification.entryTime,
          exitTime: justification.exitTime,
          hoursWorked: justification.hoursWorked,
          status: "presente",
        });
      }
    }

    res.status(200).json(justification);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar justificación", error: error.message });
  }
};


module.exports = { createJustification, getMyJustifications, getAllJustifications, updateJustificationStatus };