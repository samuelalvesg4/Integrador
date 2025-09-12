import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  
  // Se não há token, o usuário não está logado.
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userString);
  
  // Se a rota exige uma role específica e a role do usuário não corresponde, redireciona.
  // Por exemplo: se a rota exige 'seller' e o usuário é 'client'.
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Se o usuário está logado e tem a role correta (se aplicável), permite o acesso.
  return children;
}