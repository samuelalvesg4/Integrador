import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Carrega usuário do localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // garante que name e role existam
      setUser({
        id: parsedUser.id,
        name: parsedUser.name || "name",
        role: parsedUser.role || "client",
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("userChanged", loadUser);
    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Minha Loja
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="font-medium">
              {user.name} ({user.role === "seller" ? "Vendedor" : "Cliente"})
            </span>&nbsp;

            {/* Botões exclusivos para vendedores */}
            {user.role === "seller" && (
              <>
                <button
                  onClick={() => navigate("/RegisterProduct")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Cadastrar Produto
                </button>&nbsp;
                <button
                  onClick={() => navigate("/MyProducts")}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Meus Produtos
                </button>&nbsp;
                <button
                  onClick={() => navigate("/Sales")}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Minhas Vendas
                </button>&nbsp;
              </>
            )}

            {/* Botões para clientes */}
            {user.role !== "seller" && (
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Checkout
              </button>
            )}
            {/* Ícone do Carrinho */}
        <button className="relative">
        <ShoppingCart className="w-3 h-3 text-white" />
        {/* Badge de quantidade (opcional) */}
        <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1">
          0
        </span>
      </button>&nbsp;
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </Link>&nbsp;
            <Link
              to="/register"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cadastro
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
