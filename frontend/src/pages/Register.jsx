import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { register } from "../services/api";
import Logo from '../components/logosemd.png';
import '../index.css';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await register(name, email, password, role);

      localStorage.setItem("user", JSON.stringify({
        userId: data.id,
        name: name,
        email: email,
        role: role
      }));

      window.dispatchEvent(new Event("userChanged"));

      alert("Cadastro realizado com sucesso!");
      navigate("/login"); // Redireciona para login após o cadastro
    } catch (err) {
      console.error(err);
      setError(err.body?.error || "Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <Link to="/">
            <img src={Logo} alt="Logo da Loja" />
          </Link>
        </div>
        <h2 className="auth-title">
          Crie sua Conta
        </h2>
        
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
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
              placeholder="seu@email.com"
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
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="role">Tipo de Conta</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="customer">Cliente</option>
              <option value="seller">Vendedor</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">
            Cadastrar
          </button>
        </form>

        <p className="auth-switch-link">
          Já tem uma conta?{' '}
          <Link to="/login">Acesse sua conta</Link>
        </p>
      </div>
      </div>
    </div>
  );
}