import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useEmployeeData = () => {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [salary, setSalary] = useState(null);
  const [deductions, setDeductions] = useState({ total: 0 });
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No hay token en localStorage. Redirigiendo al login...");
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [userRes, attendanceRes, salaryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/profile", { headers }),
          axios.get("http://localhost:5000/api/attendance/my-status", { headers }).catch(() => ({ data: [] })),
          axios.get("http://localhost:5000/api/salaries/my-details", { headers }).catch(() => ({ data: { salary: 0, totalDeductions: 0 } })),
        ]);

        if (isMounted.current) {
          setEmployee(userRes.data);
          setAttendance(attendanceRes.data || []);
          setSalary(salaryRes.data.salary || 0);
          setDeductions({ total: salaryRes.data.totalDeductions || 0 });
        }
      } catch (error) {
        console.error("❌ Error cargando datos:", error.response?.data || error.message);

        if (error.response?.status === 401) {
          console.warn("⚠️ Token inválido. Redirigiendo al login...");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  // ✅ Definimos `handleJustify` antes del `return`
  const handleJustify = async (justificationData) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("❌ No hay token en localStorage.");
      alert("Tu sesión ha expirado, por favor inicia sesión nuevamente.");
      navigate("/login");
      return;
    }
  
    try {
      const headers = { Authorization: `Bearer ${token}` }; // ✅ Aseguramos el formato correcto
      console.log("📤 Enviando justificación con token:", token); // 🔍 Verifica si el token está bien
  
      const response = await axios.post(
        "http://localhost:5000/api/justifications",
        {
          date: new Date(justificationData.date).toISOString(),
          message: justificationData.message,
          entryTime: justificationData.absencePeriod?.start || null,
          exitTime: justificationData.absencePeriod?.end || null,
          photoUrl: justificationData.photo || null,
        },
        { headers } // ✅ Se envía el token correctamente
      );
  
      alert("✅ Justificación enviada con éxito");
      console.log("📤 Justificación enviada:", response.data);
    } catch (error) {
      console.error("❌ Error al enviar justificación:", error.response?.data || error.message);
      alert("❌ No se pudo enviar la justificación. Revisa la consola.");
    }
  };
  

  return { employee, salary, deductions, attendance, handleJustify }; // ✅ Ahora `handleJustify` está definido
};

export default useEmployeeData;
