import React, { useState } from "react";
import AttendanceCalendar from "../components/Attendance/AttendanceCalendar";
import JustificationModal from "../components/Attendance/JustificationModal";
import useEmployeeData from "../hooks/useEmployeeData";
import "../styles.css";

const EmployeeDashboard = () => {
  const { employee, salary, deductions, attendance, handleJustify } = useEmployeeData();
  const [selectedDate, setSelectedDate] = useState(null);

  const openModal = (date) => {
    console.log("📅 Fecha seleccionada para justificación:", date);
    setSelectedDate(date);
  };

  return (
    <div className="container">
      <h1>🏢 Dashboard del Empleado</h1>

      {/* Información del empleado */}
      <div className="employee-info">
        <h2>🕒 Horario</h2>
        <p>📌 {employee?.scheduleType === "completo" ? "8:30 - 13:00 | 15:00 - 19:00" : "8:30 - 13:00"}</p>
        <p>💰 Sueldo Base: S/ {employee?.baseSalary}</p>
      </div>

      {/* Calendario de asistencia */}
      <AttendanceCalendar attendance={attendance} onSelectDate={openModal} />

      {/* Resumen financiero */}
      <div className="salary-summary">
        <h2>💵 Sueldo Correspondiente</h2>
        <p>Total Descuentos: S/ {deductions?.total}</p>
        <p>💰 Sueldo Final: <strong>S/ {salary?.netSalary}</strong></p>
      </div>

      {/* Modal de Justificación */}
      {selectedDate && (
        <JustificationModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSubmit={handleJustify} // ✅ Aquí pasamos directamente la función
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
