import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Falha no login");
        return;
      }

      // Salva o usuário e token corretamente
      localStorage.setItem(
        "token",
        data.token
      );
      localStorage.setItem("user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          role: data.user.role,
          email: data.user.email,
        })
      );

      // Dispara evento para atualizar o Header
      window.dispatchEvent(new Event("userChanged"));

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor");
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
