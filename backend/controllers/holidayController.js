const Holiday = require("../models/Holiday");

// Crear día festivo
const createHoliday = async (req, res) => {
  const { name, date } = req.body;

  try {
    const holiday = await Holiday.create({
      name,
      date,
      createdBy: req.user.id
    });

    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: "Error al crear día festivo", error: error.message });
  }
};

// Obtener todos los días festivos
const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener días festivos", error: error.message });
  }
};

// Eliminar día festivo
const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    
    if (!holiday) {
      return res.status(404).json({ message: "Día festivo no encontrado" });
    }
    
    await holiday.remove();
    res.status(200).json({ message: "Día festivo eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar día festivo", error: error.message });
  }
};

module.exports = { createHoliday, getHolidays, deleteHoliday };