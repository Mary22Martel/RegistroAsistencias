import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/login">Iniciar Sesión</Link>
      <Link to="/register">Registrarse</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/reports">Reportes</Link>
    </nav>
  );
};

export default Navbar;