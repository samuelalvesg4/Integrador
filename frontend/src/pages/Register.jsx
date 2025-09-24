import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api"; // <-- 1. IMPORTAMOS a função do nosso arquivo central
import Logo from '../components/logosemd.png';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. VEJA COMO A FUNÇÃO FICOU MAIS SIMPLES
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Apenas chamamos a função 'register' e passamos os dados.
      // Toda a lógica de fetch, URL, headers, etc. está escondida no api.js!
      await register(name, email, password, role);
      
      alert("Cadastro realizado com sucesso! Faça o login para continuar.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.body?.message || "Não foi possível criar a conta. Tente outro e-mail.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <Link to="/">
            <img src={Logo} alt="Logo SEMD" />
          </Link>
        </div>
        <h2 className="auth-title">
          Criar Nova Conta
        </h2>

        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">Eu quero</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="customer">Comprar</option>
              <option value="seller">Vender</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">
            Criar Conta
          </button>
        </form>

        <p className="auth-switch-link">
          Já tem uma conta?{' '}
          <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}