import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from '../context/CartContext';
import useUser from '../hooks/useUser';
import Logo from './logosemd.png';

export default function Header() {
    const user = useUser();
    const navigate = useNavigate();
    const { cartItems } = useCart();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        navigate("/login");
    };

    const totalItems = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const isLoggedIn = !!user;
    const isSeller = user?.role === "seller";
    const isCustomer = user?.role === "customer" || user?.role === "client";

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
                <img src={Logo} alt="Logo da Loja" className="h-[50px]" />
            </Link>

            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <div className="user-actions">
                          <span className="font-medium">
                              Olá, {user.name}
                          </span>
                          {isSeller && (
                              <>
                                  <Link to="/my-products" className="text-gray-600 hover:text-blue-600">Meus Produtos</Link>
                                  <Link to="/sales" className="text-gray-600 hover:text-blue-600">Minhas Vendas</Link>
                                  <Link to="/seller-dashboard" className="text-gray-600 hover:text-blue-600">Painel</Link>
                              </>
                          )}
                          {isCustomer && (
                              <>
                                  <Link to="/customer-dashboard" className="text-gray-600 hover:text-blue-600">Meus Pedidos</Link>
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
                              </>
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