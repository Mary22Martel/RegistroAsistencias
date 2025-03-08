import React, { useState } from "react";
import axios from "axios";

const JustificationForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/justifications", formData, {
        headers: { "x-auth-token": token },
      });
      console.log(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Enviar Justificación</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <textarea
          name="reason"
          placeholder="Motivo"
          value={formData.reason}
          onChange={handleChange}
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default JustificationForm;