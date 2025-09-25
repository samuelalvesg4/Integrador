// frontend/src/pages/SellerDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import Header from '../components/Header';
import './SellerDashboard.css'; // Vamos criar este arquivo de estilo a seguir

export default function SellerDashboard() {
    const user = useUser();

    return (
        <div>
            <Header />
            <main className="dashboard-container">
                <h2>Painel do Vendedor</h2>
                <p className="dashboard-subtitle">Olá, {user?.name}! Gerencie sua loja e acompanhe suas vendas.</p>
                
                <div className="dashboard-grid">
                    <Link to="/my-products" className="dashboard-card">
                        <h2>Meus Produtos</h2>
                        <p>Visualize, edite e gerencie o estoque dos seus produtos.</p>
                    </Link>
                    <Link to="/sales" className="dashboard-card">
                        <h2>Minhas Vendas</h2>
                        <p>Acompanhe o histórico completo de todas as suas vendas.</p>
                    </Link>
                    <Link to="/register-product" className="dashboard-card">
                        <h2>Cadastrar Produto</h2>
                        <p>Adicione um novo item à sua vitrine para começar a vender.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}