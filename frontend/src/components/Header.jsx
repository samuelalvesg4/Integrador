import React from 'react'; // Não precisamos de useState e useEffect aqui mais
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from '../context/CartContext';
import useUser from '../hooks/useUser'; // 1. Usando nosso hook centralizado

export default function Header() {
    const user = useUser(); // O hook já nos dá o usuário e se atualiza sozinho
    const navigate = useNavigate();
    
    // 2. Corrigindo para 'cartItems', que é o nome correto exportado pelo seu contexto
    const { cartItems } = useCart();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // 3. Disparando o evento para que o hook useUser atualize a UI em tempo real
        window.dispatchEvent(new Event("userChanged")); 
        
        navigate("/login");
    };

    // Calcula a quantidade total de itens no carrinho
    const totalItems = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    // 4. Criando flags para facilitar a leitura no JSX
    const isLoggedIn = !!user;
    const isSeller = user?.role === "seller";
    const isCustomer = user?.role === "customer" || user?.role === "client"; // Aceita os dois nomes

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                Minha Loja
            </Link>

            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    // --- VISÃO QUANDO ESTÁ LOGADO ---
                    <>
                        <div className="user-actions">
                          <span className="font-medium">
                              Olá, {user.name}
                          </span>
                          {/* --- MENUS EXCLUSIVOS DO VENDEDOR --- */}
                          {isSeller && (
                              <>
                                  <Link to="/my-products" className="text-gray-600 hover:text-blue-600">Meus Produtos</Link>
                                  <Link to="/sales" className="text-gray-600 hover:text-blue-600">Minhas Vendas</Link>
                              </>
                          )}
                          {/* --- MENUS EXCLUSIVOS DO CLIENTE --- */}
                          {isCustomer && (
                              <button
                                  className="relative"
                                  onClick={() => navigate("/cart")}
                              >
                                  <ShoppingCart className="w-6 h-6 text-gray-800" />
                                  {totalItems > 0 && (
                                      <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                                          {totalItems}
                                      </span>
                                  )}
                              </button>
                          )}
                          
                          <button
                              onClick={handleLogout}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                              Sair
                          </button>
                        </div>
                    </>
                ) : (
                    // --- VISÃO QUANDO ESTÁ DESLOGADO ---
                    <>
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Login
                        </Link>
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