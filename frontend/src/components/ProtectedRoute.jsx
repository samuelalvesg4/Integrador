// Exemplo de ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      setIsAuthenticated(false);
    } else {
      const user = JSON.parse(userString);
      if (role && user.role !== role) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }
    setHasChecked(true);
  }, [role]);

  if (!hasChecked) {
    return null; // ou um spinner de carregamento
  }

  if (isAuthenticated) {
    return children;
  } else {
    // Redireciona com base na verificação final
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && role && user.role !== role) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }
}