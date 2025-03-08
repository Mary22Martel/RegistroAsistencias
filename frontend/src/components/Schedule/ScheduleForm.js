import React, { useState } from "react";
import axios from "axios";

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    startTime: "",
    endTime: "",
    date: "",
    type: "completo",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/schedules/assign", formData, {
        headers: { "x-auth-token": token },
      });
      console.log(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Asignar Horario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="employeeId"
          placeholder="ID del Empleado"
          value={formData.employeeId}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="completo">Completo</option>
          <option value="medio tiempo">Medio Tiempo</option>
        </select>
        <button type="submit">Asignar Horario</button>
      </form>
    </div>
  );
};

export default ScheduleForm;