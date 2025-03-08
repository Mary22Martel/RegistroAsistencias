const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const fs = require("fs");

const generatePDFReport = async (req, res) => {
  const { employeeId, month, year } = req.body;

  try {
    const doc = new PDFDocument();
    const filePath = `./reports/report_${employeeId}_${month}_${year}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text("Reporte de Sueldo", { align: "center" });
    doc.fontSize(15).text(`Empleado: ${employeeId}`, { align: "left" });
    doc.text(`Mes: ${month}/${year}`, { align: "left" });
    doc.text(`Sueldo Neto: $${req.body.netSalary}`, { align: "left" });
    doc.end();

    res.status(200).download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Error al generar el reporte PDF" });
  }
};

const generateExcelReport = async (req, res) => {
  const { employeeId, month, year, netSalary } = req.body;

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    worksheet.columns = [
      { header: "Empleado", key: "employeeId", width: 20 },
      { header: "Mes", key: "month", width: 15 },
      { header: "Año", key: "year", width: 15 },
      { header: "Sueldo Neto", key: "netSalary", width: 15 },
    ];

    worksheet.addRow({ employeeId, month, year, netSalary });

    const filePath = `./reports/report_${employeeId}_${month}_${year}.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    res.status(200).download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Error al generar el reporte Excel" });
  }
};

module.exports = { generatePDFReport, generateExcelReport };