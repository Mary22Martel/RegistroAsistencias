import React, { useState, useEffect } from "react";
import axios from "axios";

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/holidays", {
          headers: { "x-auth-token": token },
        });
        setHolidays(res.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchHolidays();
  }, []);

  return (
    <div>
      <h2>Días Festivos</h2>
      <ul>
        {holidays.map((holiday) => (
          <li key={holiday._id}>
            {holiday.date} - {holiday.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidayList;