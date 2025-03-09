import React, { useEffect, useState } from "react";
import ScheduleForm from "../components/Schedule/ScheduleForm";
import HolidayForm from "../components/Holiday/HolidayForm";
import HolidayList from "../components/Holiday/HolidayList";
import JustificationList from "../components/Justification/JustificationList";
import axios from "axios";
import "../styles.css";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard del Administrador</h1>
      <ScheduleForm />
      <HolidayForm />
      <HolidayList />
      <JustificationList />
      <h2>Lista de Empleados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
