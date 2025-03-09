const Salary = require("../models/Salary");
const Attendance = require("../models/Attendance");
const Schedule = require("../models/Schedule");
const Holiday = require("../models/Holiday");
const User = require("../models/User");
const pdfkit = require("pdfkit");
const fs = require("fs");
const exceljs = require("exceljs");

// Calcular sueldo para un empleado
const calculateSalary = async (req, res) => {
  const { userId, month, year } = req.body;
  
  try {
    // Obtener usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Obtener horario asignado
    const schedule = await Schedule.findOne({ userId });
    if (!schedule) {
      return res.status(404).json({ message: "Horario no asignado" });
    }
    
    const baseSalary = schedule.baseSalary;
    const hourlyRate = schedule.hourlyRate;
    
    // Obtener días festivos
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const holidays = await Holiday.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Obtener asistencias
    const attendances = await Attendance.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calcular días laborables en el mes (excluir fines de semana y festivos)
    const daysInMonth = endDate.getDate();
    let workingDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      // Excluir fines de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Verificar si es día festivo
        const isHoliday = holidays.some(holiday => 
          holiday.date.getDate() === date.getDate() && 
          holiday.date.getMonth() === date.getMonth() && 
          holiday.date.getFullYear() === date.getFullYear()
        );
        
        if (!isHoliday) {
          workingDays++;
        }
      }
    }
    
    // Calcular horas esperadas
    let expectedHours = 0;
    
    if (schedule.scheduleType === "completo") {
      // Tiempo completo: mañana + tarde
      const morningStart = schedule.startMorning.split(":");
      const morningEnd = schedule.endMorning.split(":");
      const morningHours = (parseInt(morningEnd[0]) - parseInt(morningStart[0])) + 
        (parseInt(morningEnd[1]) - parseInt(morningStart[1])) / 60;
      
      const afternoonStart = schedule.startAfternoon.split(":");
      const afternoonEnd = schedule.endAfternoon.split(":");
      const afternoonHours = (parseInt(afternoonEnd[0]) - parseInt(afternoonStart[0])) + 
        (parseInt(afternoonEnd[1]) - parseInt(afternoonStart[1])) / 60;
      
      expectedHours = workingDays * (morningHours + afternoonHours);
    } else {
      // Medio tiempo: solo mañana
      const morningStart = schedule.startMorning.split(":");
      const morningEnd = schedule.endMorning.split(":");
      const morningHours = (parseInt(morningEnd[0]) - parseInt(morningStart[0])) + 
        (parseInt(morningEnd[1]) - parseInt(morningStart[1])) / 60;
      
      expectedHours = workingDays * morningHours;
    }
    
    // Calcular horas trabajadas y calcular deducción
    let hoursWorked = 0;
    attendances.forEach(attendance => {
      if (attendance.status === "presente") {
        hoursWorked += attendance.hoursWorked;
      }
    });
    
    const missingHours = Math.max(0, expectedHours - hoursWorked);
    const totalDeductions = missingHours * hourlyRate;
    const netSalary = Math.max(0, baseSalary - totalDeductions);
    
    // Guardar el cálculo del sueldo
    let salary = await Salary.findOne({ userId, month, year });
    
    if (salary) {
      salary.baseSalary = baseSalary;
      salary.totalDeductions = totalDeductions;
      salary.netSalary = netSalary;
      await salary.save();
    } else {
      salary = await Salary.create({
        userId,
        month,
        year,
        baseSalary,
        totalDeductions,
        netSalary
      });
    }
    
    res.status(200).json({
      salary,
      details: {
        workingDays,
        expectedHours,
        hoursWorked,
        missingHours,
        hourlyRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error al calcular sueldo", error: error.message });
  }
};

// Generar reporte PDF
const generatePdfReport = async (req, res) => {
  const { userId, month, year } = req.query;
  
  try {
    // Obtener datos necesarios
    const user = await User.findById(userId);
    const salary = await Salary.findOne({ userId, month, year });
    const schedule = await Schedule.findOne({ userId });
    
    if (!user || !salary || !schedule) {
      return res.status(404).json({ message: "Datos no encontrados" });
    }
    
    // Crear PDF
    const doc = new pdfkit();
    
    // Configurar response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_${user.name}_${month}_${year}.pdf`);
    
    doc.pipe(res);
    
    // Añadir contenido
    doc.fontSize(16).text('Reporte de Sueldo', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Empleado: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Mes: ${month}/${year}`);
    doc.moveDown();
    
    doc.text(`Tipo de Horario: ${schedule.scheduleType}`);
    doc.text(`Sueldo Base: S/ ${salary.baseSalary.toFixed(2)}`);
    doc.text(`Total Deducciones: S/ ${salary.totalDeductions.toFixed(2)}`);
    doc.text(`Sueldo Neto: S/ ${salary.netSalary.toFixed(2)}`);
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error al generar reporte PDF", error: error.message });
  }
};

// Generar reporte Excel
const generateExcelReport = async (req, res) => {
  const { month, year } = req.query;
  
  try {
    // Obtener todos los salarios del mes
    const salaries = await Salary.find({ month, year }).populate({
      path: 'userId',
      select: 'name email'
    });
    
    // Crear workbook
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Sueldos');
    
    // Añadir encabezados
    worksheet.columns = [
      { header: 'Empleado', key: 'employee', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Sueldo Base', key: 'baseSalary', width: 15 },
      { header: 'Deducciones', key: 'deductions', width: 15 },
      { header: 'Sueldo Neto', key: 'netSalary', width: 15 }
    ];
    
    // Añadir datos
    salaries.forEach(salary => {
      worksheet.addRow({
        employee: salary.userId.name,
        email: salary.userId.email,
        baseSalary: salary.baseSalary,
        deductions: salary.totalDeductions,
        netSalary: salary.netSalary
      });
    });
    
    // Configurar estilos
    worksheet.getRow(1).font = { bold: true };
    
    // Configurar response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_sueldos_${month}_${year}.xlsx`);
    
    // Enviar Excel
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error al generar reporte Excel", error: error.message });
  }
};

module.exports = { calculateSalary, generatePdfReport, generateExcelReport };