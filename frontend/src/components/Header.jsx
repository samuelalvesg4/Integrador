import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from '../context/CartContext';
import useUser from '../hooks/useUser';
import Logo from './logosemd.png';
import './Header.css';

export default function Header() {
    const user = useUser();
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        setIsMenuOpen(false);
        navigate("/login");
    };
    
    const closeMenu = () => setIsMenuOpen(false);
    const totalItems = Array.isArray(cartItems) ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const isLoggedIn = !!user;
    const isSeller = user?.role === "seller";
    const isCustomer = user?.role === "customer" || user?.role === "client";

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo-link">
                    <img src={Logo} alt="Logo da Loja" className="logo-img" />
                </Link>

                {/* --- NAVEGAÇÃO DE DESKTOP --- */}
                <nav className="desktop-nav">
                    {isLoggedIn ? (
                        <>
                            <span>Olá, {user.name}</span>
                            {isSeller && (
                                <>
                                    <Link to="/my-products" className="header-link">Meus Produtos</Link>
                                    <Link to="/sales" className="header-link">Minhas Vendas</Link>
                                </>
                            )}
                            {isCustomer && (
                                <>
                                    <Link to="/customer-dashboard" className="header-link">Meus Pedidos</Link>
                                    <button className="cart-button" onClick={() => navigate("/cart")}>
                                        <ShoppingCart />
                                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                                    </button>
                                </>
                            )}
                            <button onClick={handleLogout} className="logout-button">Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-link">Login</Link>
                            <Link to="/register" className="header-link">Cadastro</Link>
                        </>
                    )}
                </nav>

                {/* --- BOTÃO HAMBÚRGUER --- */}
                <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* --- MENU MOBILE QUE EMPURRA --- */}
                <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    {isLoggedIn ? (
                        <>
                            <span>Olá, {user.name}</span>
                            {isSeller && (
                                <>
                                    <Link to="/my-products" onClick={closeMenu} className="header-link">Meus Produtos</Link>
                                    <Link to="/sales" onClick={closeMenu} className="header-link">Minhas Vendas</Link>
                                </>
                            )}
                            {isCustomer && (
                                <>
                                    <Link to="/customer-dashboard" onClick={closeMenu} className="header-link">Meus Pedidos</Link>
                                    <Link to="/cart" onClick={closeMenu} className="header-link">Carrinho ({totalItems})</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="logout-button">Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu} className="header-link">Login</Link>
                            <Link to="/register" onClick={closeMenu} className="header-link">Cadastro</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}