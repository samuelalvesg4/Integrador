import React from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, PlusSquare } from 'lucide-react';
import useUser from '../hooks/useUser';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DashboardCard = ({ to, icon, title, description, buttonText }) => {
  return (
    <Link to={to} className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-button">
        {buttonText} <span>→</span>
      </div>
    </Link>
  );
};

export default function SellerDashboard() {
    const user = useUser();

    return (
        <div className="page-container">
            <Header />
            <main className="content-wrap">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                      <h1 className="dashboard-title">Painel do Vendedor</h1>
                      <p className="dashboard-subtitle">
                        Olá, <span className="user-name">{user?.name || 'Vendedor'}</span>! Gerencie sua loja e acompanhe suas vendas.
                      </p>
                    </div>
                    
                    <div className="dashboard-grid">
                        <DashboardCard 
                          to="/my-products"
                          icon={<Package size={40} />}
                          title="Meus Produtos"
                          description="Visualize, edite e gerencie o estoque dos seus produtos."
                          buttonText="Gerenciar Produtos"
                        />
                        <DashboardCard 
                          to="/sales"
                          icon={<DollarSign size={40} />}
                          title="Minhas Vendas"
                          description="Acompanhe o histórico completo de todas as suas vendas."
                          buttonText="Ver Vendas"
                        />
                        <DashboardCard 
                          to="/register-product"
                          icon={<PlusSquare size={40} />}
                          title="Cadastrar Produto"
                          description="Adicione um novo item à sua vitrine para começar a vender."
                          buttonText="Adicionar Item"
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}