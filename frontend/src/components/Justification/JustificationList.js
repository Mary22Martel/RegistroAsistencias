import React, { useState, useEffect } from "react";
import axios from "axios";

const JustificationList = () => {
  const [justifications, setJustifications] = useState([]);

  useEffect(() => {
    const fetchJustifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/justifications", {
          headers: { "x-auth-token": token },
        });
        setJustifications(res.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchJustifications();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/justifications/${id}/approve`, {}, {
        headers: { "x-auth-token": token },
      });
      setJustifications(justifications.map((j) => (j._id === id ? { ...j, status: "aprobada" } : j)));
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Justificaciones Pendientes</h2>
      <ul>
        {justifications.map((justification) => (
          <li key={justification._id}>
            {justification.date} - {justification.reason} ({justification.status})
            {justification.status === "pendiente" && (
              <button onClick={() => handleApprove(justification._id)}>Aprobar</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JustificationList;