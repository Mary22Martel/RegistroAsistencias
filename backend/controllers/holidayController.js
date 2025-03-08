const Holiday = require("../models/Holiday");

// Agregar un día festivo
const addHoliday = async (req, res) => {
  const { date, description } = req.body;

  try {
    const holiday = await Holiday.create({ date, description });
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el día festivo" });
  }
};

// Listar todos los días festivos
const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los días festivos" });
  }
};

module.exports = { addHoliday, getHolidays };