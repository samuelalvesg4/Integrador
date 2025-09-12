import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { login } from "../services/api"; // O caminho de importação foi corrigido

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("userChanged"));

      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.body?.error || "Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}