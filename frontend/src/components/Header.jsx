import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from '../context/CartContext';
import useUser from '../hooks/useUser';
import Logo from './logosemd.png';

export default function Header() {
  const user = useUser();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lógica para fechar o dropdown se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const totalItems = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const isLoggedIn = !!user;
  const isSeller = user?.role === "seller";
  const isCustomer = user?.role === "customer" || user?.role === "client";

  return (
    <header className="header">
      {/* GRUPO DA ESQUERDA: Logo, Bebidas, Alimentos */}
      <div className="header-left">
        <Link to="/" className="header-logo">
          <img src={Logo} alt="Logo da Loja" />
        </Link>
        <nav className="header-nav">
          <NavLink to="/section/bebidas">Bebidas</NavLink>
          <NavLink to="/section/alimentos">Alimentos</NavLink>
        </nav>
      </div>

      {/* GRUPO DA DIREITA: Ações do Usuário */}
      <div className="header-right">
        {isLoggedIn ? (
          // Se o usuário está LOGADO
          <>
            {isCustomer && (
              <Link to="/cart" className="cart-icon">
                <ShoppingCart size={24} />
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            )}
            
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button className="user-dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                Olá, {user.name}
                <ChevronDown size={20} className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  {isSeller && (
                    <>
                      <Link to="/seller-dashboard" className="dropdown-item">Meu Painel</Link>
                      <Link to="/register-product" className="dropdown-item">Anunciar Produto</Link>
                      <Link to="/my-products" className="dropdown-item">Meus Produtos</Link>
                      <Link to="/sales" className="dropdown-item">Minhas Vendas</Link>
                    </>
                  )}
                  {isCustomer && (
                    <Link to="/customer-dashboard" className="dropdown-item">Meus Pedidos</Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">Sair</button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Se o usuário está DESLOGADO
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Cadastro</Link>
          </>
        )}
      </div>
    </header>
  );
}