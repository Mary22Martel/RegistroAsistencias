import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeSchedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/schedules/employee/me", {
          headers: { "x-auth-token": token },
        });
        setSchedules(res.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div>
      <h2>Mis Horarios</h2>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule._id}>
            {schedule.date} - {schedule.startTime} a {schedule.endTime} ({schedule.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeSchedule;