import React, { useState } from "react";
import axios from "axios";

const SalaryCalculator = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/salaries/calculate", formData, {
        headers: { "x-auth-token": token },
      });
      console.log(res.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Calcular Sueldo</h2>
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
          type="number"
          name="month"
          placeholder="Mes"
          value={formData.month}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Año"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <button type="submit">Calcular</button>
      </form>
    </div>
  );
};

export default SalaryCalculator;