const Schedule = require("../models/Schedule");
const User = require("../models/User");
const exceljs = require("exceljs");

// ✅ Asignar horario a un empleado
const assignSchedule = async (req, res) => {
  const { userId, scheduleType, startMorning, endMorning, startAfternoon, endAfternoon, baseSalary, hourlyRate } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let schedule = await Schedule.findOne({ userId });

    if (schedule) {
      schedule.scheduleType = scheduleType;
      schedule.startMorning = startMorning;
      schedule.endMorning = endMorning;
      schedule.startAfternoon = startAfternoon;
      schedule.endAfternoon = endAfternoon;
      schedule.baseSalary = baseSalary;
      schedule.hourlyRate = hourlyRate;
      await schedule.save();
    } else {
      schedule = await Schedule.create({
        userId,
        scheduleType,
        startMorning,
        endMorning,
        startAfternoon,
        endAfternoon,
        baseSalary,
        hourlyRate,
      });
    }

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error al asignar horario", error: error.message });
  }
};

// ✅ Obtener horario de un empleado
const getEmployeeSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ userId: req.user.id });

    if (!schedule) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horario", error: error.message });
  }
};

// ✅ Obtener todos los horarios (solo admin)
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("userId", "name email");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horarios", error: error.message });
  }
};

// ✅ Procesar archivo de horarios (Excel)
const processScheduleExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);

    const schedules = [];
    worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber > 1) {
        const email = row.getCell(1).value;
        const scheduleType = row.getCell(2).value;
        const startMorning = row.getCell(3).value;
        const endMorning = row.getCell(4).value;
        const startAfternoon = row.getCell(5).value || null;
        const endAfternoon = row.getCell(6).value || null;
        const baseSalary = row.getCell(7).value;
        const hourlyRate = row.getCell(8).value;

        const user = await User.findOne({ email });
        if (user) {
          let schedule = await Schedule.findOne({ userId: user._id });
          if (schedule) {
            schedule.scheduleType = scheduleType;
            schedule.startMorning = startMorning;
            schedule.endMorning = endMorning;
            schedule.startAfternoon = startAfternoon;
            schedule.endAfternoon = endAfternoon;
            schedule.baseSalary = baseSalary;
            schedule.hourlyRate = hourlyRate;
            await schedule.save();
          } else {
            schedule = await Schedule.create({
              userId: user._id,
              scheduleType,
              startMorning,
              endMorning,
              startAfternoon,
              endAfternoon,
              baseSalary,
              hourlyRate,
            });
          }
          schedules.push(schedule);
        }
      }
    });

    res.status(200).json({ message: "Horarios procesados correctamente", count: schedules.length });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar el archivo de horarios", error: error.message });
  }
};

// ✅ Exportar todas las funciones correctamente
module.exports = { 
  assignSchedule, 
  getEmployeeSchedule, 
  getAllSchedules, 
  processScheduleExcel 
};
