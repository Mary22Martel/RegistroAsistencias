const Justification = require("../models/Justification");
const Attendance = require("../models/Attendance");

// ✅ Crear Justificación (Empleado)
const createJustification = async (req, res) => {
  const { date, entryTime, exitTime, hoursWorked, message, photoUrl, shift } = req.body;

  try {
    // 🔹 Verificar si ya existe una justificación para la misma fecha y turno
    const existingJustification = await Justification.findOne({
      userId: req.user.id,
      date,
      shift,
    });

    if (existingJustification) {
      return res.status(400).json({ message: "Ya existe una justificación para este turno y fecha." });
    }

    // 🔹 Crear la justificación
    const justification = await Justification.create({
      userId: req.user.id,
      date,
      entryTime,
      exitTime,
      hoursWorked,
      message,
      photoUrl,
      shift, // "mañana" o "tarde"
      status: "pendiente", // Por defecto, la justificación es "pendiente"
    });

    res.status(201).json(justification);
  } catch (error) {
    res.status(500).json({ message: "Error al crear justificación", error: error.message });
  }
};

// ✅ Obtener Justificaciones del Empleado Logueado
const getMyJustifications = async (req, res) => {
  try {
    const justifications = await Justification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(justifications);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener justificaciones", error: error.message });
  }
};

// ✅ Obtener Todas las Justificaciones (Admin)
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

// ✅ Aprobar o Rechazar Justificación (Admin)
const updateJustificationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const justification = await Justification.findById(req.params.id);

    if (!justification) {
      return res.status(404).json({ message: "Justificación no encontrada" });
    }

    justification.status = status;
    await justification.save();

    // 🔹 Si la justificación es aprobada, actualizar la asistencia
    if (status === "aprobado") {
      let attendance = await Attendance.findOne({
        userId: justification.userId,
        date: justification.date,
      });

      if (attendance) {
        // 🔹 Si existe asistencia, actualizamos los datos solo si están vacíos
        attendance.entryTime = justification.entryTime || attendance.entryTime;
        attendance.exitTime = justification.exitTime || attendance.exitTime;
        attendance.hoursWorked = justification.hoursWorked || attendance.hoursWorked;

        // Si la justificación es de tardanza, ajustamos el estado
        if (justification.shift) {
          attendance.status = "tardanza";
        } else {
          attendance.status = "presente";
        }

        await attendance.save();
      } else {
        // 🔹 Si no hay asistencia, la creamos con los datos de la justificación
        await Attendance.create({
          userId: justification.userId,
          date: justification.date,
          entryTime: justification.entryTime,
          exitTime: justification.exitTime,
          hoursWorked: justification.hoursWorked,
          status: justification.shift ? "tardanza" : "presente",
        });
      }
    }

    res.status(200).json(justification);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar justificación", error: error.message });
  }
};

// ✅ Exportar las funciones correctamente
module.exports = {
  createJustification,
  getMyJustifications,
  getAllJustifications,
  updateJustificationStatus,
};
