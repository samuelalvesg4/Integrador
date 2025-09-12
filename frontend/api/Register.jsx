import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // "client" ou "seller"
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Falha no cadastro");
        return;
      }

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleRegister}
          className="bg-white p-6 rounded-2xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Cadastro</h2>

          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="client">Cliente</option>
            <option value="seller">Vendedor</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
