import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import Logo from '../components/logosemd.png'; // Verifique o caminho da logo

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Sua lógica de submit continua a mesma
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userChanged"));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.body?.error || "E-mail ou senha inválidos. Tente novamente.");
    }
  };

  return (
    // As classes aqui agora são do seu arquivo index.css
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-container">
          <Link to="/">
            <img src={Logo} alt="Logo SEMD" />
          </Link>
        </div>
        <h2 className="auth-title">
          Acessar sua Conta
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
  );
}