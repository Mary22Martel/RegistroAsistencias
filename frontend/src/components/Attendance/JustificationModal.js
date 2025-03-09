import React, { useState } from "react";
import "../../styles.css";

const JustificationModal = ({ date, onClose, onSubmit }) => {
  const [justificationType, setJustificationType] = useState("tardanza");
  const [shift, setShift] = useState(""); // Nuevo estado para "mañana" o "tarde"
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!onSubmit || typeof onSubmit !== "function") {
      console.error("❌ ERROR: onSubmit no está definido o no es una función.");
      setError("Hubo un problema interno. No se puede enviar la justificación.");
      return;
    }

    if (!message.trim()) {
      setError("⚠️ Por favor, ingresa un mensaje de justificación.");
      return;
    }

    if (justificationType === "tardanza" && !shift) {
      setError("⚠️ Por favor, selecciona si la tardanza es en la mañana o en la tarde.");
      return;
    }

    const justificationData = {
      date: date?.date || date,
      status: justificationType, // "tardanza" o "ausente"
      shift, // "mañana" o "tarde"
      message,
      photo,
    };

    console.log("📤 Enviando justificación:", justificationData);
    onSubmit(justificationData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Justificar - {new Date(date?.date || date).toLocaleDateString()}</h2>
        <p>
          <strong>Estado:</strong> {date.status || "sin registro"}
        </p>
        {date.status === "sin registro" && (
          <p style={{ color: "orange" }}>⚠️ No hay asistencia registrada, pero puedes justificar.</p>
        )}

        {/* 🔹 Selección entre tardanza o ausencia */}
        <label>Tipo de Justificación:</label>
        <select value={justificationType} onChange={(e) => setJustificationType(e.target.value)}>
          <option value="tardanza">Tardanza</option>
          <option value="ausente">Ausencia</option>
        </select>

        {/* 🔹 Seleccionar si la tardanza es en la mañana o tarde */}
        {justificationType === "tardanza" && (
          <>
            <label>Turno de la tardanza:</label>
            <select value={shift} onChange={(e) => setShift(e.target.value)}>
              <option value="">-- Seleccionar turno --</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </>
        )}

        {/* 🔹 Mensaje obligatorio */}
        <label>Mensaje de Justificación:</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

        {/* 🔹 Subir foto opcional */}
        <label>Subir Foto:</label>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

        {error && <p className="error-message">{error}</p>}

        {/* 🔹 Botones */}
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="btn btn-primary">Enviar</button>
          <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default JustificationModal;
