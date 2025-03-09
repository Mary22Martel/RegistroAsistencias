import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Resetear errores anteriores

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));

        console.log("✅ Usuario autenticado:", res.data);

        // Esperar a que se guarde antes de redirigir
        setTimeout(() => {
          navigate(res.data.role === "admin" ? "/dashboard" : "/employee-dashboard");
        }, 500);
      } else {
        console.error("❌ No se recibió un token del backend.");
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data?.message || error.message);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
