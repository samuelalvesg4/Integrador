import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, Menu } from "lucide-react"; 
import { useCart } from '../context/CartContext';
import useUser from '../hooks/useUser';
import Logo from './logosemd.png';
import '../index.css';

export default function Header() {
  const user = useUser();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // NOVO: Estado para controlar a visibilidade do menu responsivo
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // useEffect para fechar o menu mobile ao redimensionar a tela para desktop
   useEffect(() => {
    const handleResize = () => {
      // Usamos o mesmo breakpoint do nosso CSS (768px)
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Adiciona o "ouvinte" de evento quando o componente é montado
    window.addEventListener('resize', handleResize);

    // IMPORTANTE: Remove o "ouvinte" quando o componente é desmontado para evitar vazamento de memória
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // NOVO: Função para fechar o menu móvel ao navegar
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false); // Fecha o menu mobile também
    navigate("/login");
  };

  const totalItems = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const isLoggedIn = !!user;
  const isSeller = user?.role === "seller";
  const isCustomer = user?.role === "customer" || user?.role === "client";

  // NOVO: Envolvemos o retorno em um container para o header e o menu mobile
  return (
    <div className="header-container">
      <header className="header">
        {/* GRUPO DA ESQUERDA: Logo, Bebidas, Alimentos */}
        <div className="header-left">
          <Link to="/" className="header-logo">
            <img src={Logo} alt="Logo da Loja" />
          </Link>
          
        </div>

        {/* GRUPO DA DIREITA: Ações do Usuário */}
        <div className="header-right">
          {isLoggedIn ? (
            // Se o usuário está LOGADO (versão desktop)
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
                    {/* ... (itens do dropdown - sem alterações aqui) ... */}
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
            // Se o usuário está DESLOGADO (versão desktop)
            <div className="header-auth-buttons">
              <Link to="/login" className="btn btn-login">Login</Link>
              <Link to="/register" className="btn btn-register">Cadastro</Link>
            </div>
          )}
          
          {/* NOVO: Ícone de Hambúrguer para mobile */}
          <button className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu size={28} />
          </button>
        </div>
      </header>
      
      {/* NOVO: Menu Navegação Mobile (aparece abaixo do header) */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          {/* Links de Navegação Principal */}
          
          
          <div className="mobile-nav-divider"></div>

          {/* Lógica de Usuário para Mobile */}
          {isLoggedIn ? (
            <>
              {isSeller && (
                <>
                  <Link to="/seller-dashboard" onClick={handleMobileLinkClick}>Meu Painel</Link>
                  <Link to="/register-product" onClick={handleMobileLinkClick}>Anunciar Produto</Link>
                  <Link to="/my-products" onClick={handleMobileLinkClick}>Meus Produtos</Link>
                  <Link to="/sales" onClick={handleMobileLinkClick}>Minhas Vendas</Link>
                </>
              )}
              {isCustomer && (
                 <Link to="/customer-dashboard" onClick={handleMobileLinkClick}>Meus Pedidos</Link>
              )}
              <button onClick={handleLogout} className="mobile-logout-button">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login" onClick={handleMobileLinkClick}>Login</Link>
              <Link to="/register" className="btn btn-register" onClick={handleMobileLinkClick}>Cadastro</Link>
            </>
          )}
        </nav>
      )}
    </div>
  );
}