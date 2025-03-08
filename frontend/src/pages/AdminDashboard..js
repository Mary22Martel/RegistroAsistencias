import React from "react";
import ScheduleForm from "../components/Schedule/ScheduleForm";
import HolidayForm from "../components/Holiday/HolidayForm";
import HolidayList from "../components/Holiday/HolidayList";
import JustificationList from "../components/Justification/JustificationList";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Dashboard del Admin</h1>
      <ScheduleForm />
      <HolidayForm />
      <HolidayList />
      <JustificationList />
    </div>
  );
};

export default AdminDashboard;