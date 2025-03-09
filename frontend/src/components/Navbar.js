import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Evitar error de JSON.parse(undefined)
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("❌ Error al parsear usuario:", error);
    localStorage.removeItem("user"); // Evitar futuros errores
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div>
        {!token ? (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to={user?.role === "admin" ? "/dashboard" : "/employee-dashboard"}>Inicio</Link>
            {user?.role === "admin" && <Link to="/reports">Reportes</Link>}
          </>
        )}
      </div>
      {token && (
        <div>
          <span>{user?.name || "Usuario"}</span>
          <button onClick={handleLogout} className="btn btn-danger">Cerrar Sesión</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
