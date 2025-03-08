import React from "react";
import EmployeeSchedule from "../components/Schedule/EmployeeSchedule";
import JustificationForm from "../components/Justification/JustificationForm";

const EmployeeDashboard = () => {
  return (
    <div>
      <h1>Dashboard del Empleado</h1>
      <EmployeeSchedule />
      <JustificationForm />
    </div>
  );
};

export default EmployeeDashboard;