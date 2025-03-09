import React, { useState, useEffect } from "react";
import "../../styles.css";

const JustificationModal = ({ date, onClose, onSubmit }) => {
  const [justificationType, setJustificationType] = useState("tardanza");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("📅 Abriendo modal para la fecha:", date);
  }, [date]);

  const handleSubmit = () => {
    if (!onSubmit || typeof onSubmit !== "function") {
      console.error("❌ ERROR: `onSubmit` no está definido o no es una función.");
      setError("Error interno. No se puede enviar la justificación.");
      return;
    }

    if (!message.trim()) {
      setError("⚠️ Por favor, ingresa un mensaje de justificación.");
      return;
    }

    if (justificationType === "ausente" && (!startHour || !endHour)) {
      setError("⚠️ Por favor, selecciona el periodo de ausencia.");
      return;
    }

    const justificationData = {
      date: date?.date || date,
      status: justificationType,
      message,
      photo,
      absencePeriod: justificationType === "ausente" ? { start: startHour, end: endHour } : null,
    };

    console.log("📤 Enviando justificación:", justificationData);
    onSubmit(justificationData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Justificar - {new Date(date?.date || date).toLocaleDateString()}</h2>
        <p><strong>Estado:</strong> {date.status || "sin registro"}</p>
        {date.status === "sin registro" && (
          <p style={{ color: "orange" }}>⚠️ No hay asistencia registrada, pero puedes justificar.</p>
        )}

        {error && <p className="error-message">{error}</p>}

        {/* Formulario */}
        <label>Tipo de Justificación:</label>
        <select value={justificationType} onChange={(e) => setJustificationType(e.target.value)}>
          <option value="tardanza">Tardanza</option>
          <option value="ausente">Ausencia</option>
        </select>

        <label>Mensaje de Justificación:</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

        {justificationType === "ausente" && (
          <>
            <label>Periodo de Ausencia:</label>
            <div className="time-selection">
              <input type="time" value={startHour} onChange={(e) => setStartHour(e.target.value)} />
              <input type="time" value={endHour} onChange={(e) => setEndHour(e.target.value)} />
            </div>
          </>
        )}

        <label>Subir Foto:</label>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

        {/* Botones */}
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="btn btn-primary">Enviar</button>
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default JustificationModal;
