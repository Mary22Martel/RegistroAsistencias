const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const justificationRoutes = require("./routes/justificationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const Attendance = require("./models/Attendance");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log(err));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Usar rutas de autenticación (¡antes de app.listen()!)
app.use("/api/auth", authRoutes);

// Usar rutas de horarios
app.use("/api/schedules", scheduleRoutes);

// Usar rutas de días festivos
app.use("/api/holidays", holidayRoutes);

// Usar rutas de sueldos
app.use("/api/salaries", salaryRoutes);

// Justificaciones 
app.use("/api/justifications", justificationRoutes); 

// Asistencias 
app.use("/api/attendance", attendanceRoutes);

//asistencias
// router.get("/my-status", protect, async (req, res) => {
//   try {
//     const attendance = await Attendance.find({ userId: req.user.id });
//     res.status(200).json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener asistencia", error: error.message });
//   }
// });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

