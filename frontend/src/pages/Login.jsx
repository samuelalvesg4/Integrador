// frontend/src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { login } from "../services/api";
import Logo from '../components/logosemd.png';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);

      // Limpa dados antigos antes de salvar os novos
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("userChanged"));

      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.body?.error || "Erro de comunicação com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <Link to="/">
            <img src={Logo} alt="Logo SEMD" />
          </Link>
        </div>
        <h2 className="auth-title">
          Acesse sua Conta
        </h2>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
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
          <button type="submit" className="submit-btn">
            Entrar
          </button>
        </form>

        <p className="auth-switch-link">
          Não tem uma conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
    </div>
  );
}
