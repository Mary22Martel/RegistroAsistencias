import React from "react";
import { FaCheck, FaTimes, FaExclamationTriangle, FaQuestionCircle } from "react-icons/fa";
import "../../styles.css";

const statusColors = {
  presente: { color: "#28a745", icon: <FaCheck /> }, // 🟢 Verde - Presente
  ausente: { color: "#dc3545", icon: <FaTimes /> }, // 🔴 Rojo - Ausente
  tardanza: { color: "#ffc107", icon: <FaExclamationTriangle /> }, // 🟡 Amarillo - Tardanza
  atender: { color: "#007bff", icon: <FaQuestionCircle /> }, // 🔵 Azul - Pendiente de justificación
};

const AttendanceCalendar = ({ attendance, onSelectDate }) => {
  const daysInMonth = new Date().getMonth() === 1 ? 28 : 31; 
  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="calendar-container">
      <h2>📆 Asistencia - {monthName}</h2>
      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const entry = attendance?.find(a => new Date(a.date).getDate() === day);
          const status = entry ? statusColors[entry.status] : { color: "#ddd", icon: null };

          return (
            <div
              key={day}
              className="calendar-day"
              style={{ backgroundColor: status.color }}
              onClick={() => {
                console.log("Día seleccionado:", day, "Datos:", entry);
                onSelectDate(entry || { date: new Date().setDate(day), status: "sin registro" });
              }}
            >
              <span>{day}</span> {status.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
