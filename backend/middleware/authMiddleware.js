const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Middleware para proteger rutas (verifica token)
const protect = async (req, res, next) => {
  let token = req.headers["authorization"]; // ✅ Obtener el token de los headers

  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // ✅ Extraer solo el token sin "Bearer"
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error.message);
    res.status(401).json({ message: "No autorizado, token inválido" });
  }
};

// ✅ Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado, se requiere rol de administrador" });
  }
  next();
};

module.exports = { protect, isAdmin };
