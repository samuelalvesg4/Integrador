// frontend/src/pages/CustomerDashboard.jsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getOrders, cancelOrder } from '../services/api';
// Não precisamos importar o CSS externo mais
// import '../pages/MyProducts.css';

export default function CustomerDashboard() {
    useAuth({ role: 'customer' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const dashboardStyles = `
        .customer-dashboard-wrapper {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .text-red-500 {
            color: #ef4444;
        }
        .text-green-500 {
            color: #22c55e;
        }
        .bg-red-500 {
            background-color: #ef4444;
        }
        .hover\:bg-red-600:hover {
            background-color: #dc2626;
        }
    `;

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
            alert(err?.body?.message || "Erro ao buscar seus pedidos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) {
            return;
        }

        try {
            await cancelOrder(orderId);
            alert("Pedido cancelado com sucesso!");
            fetchOrders();
        } catch (err) {
            console.error("Erro ao cancelar pedido:", err);
            alert(err?.body?.error || "Ocorreu um erro ao tentar cancelar o pedido.");
        }
    };

    const formatPrice = (priceCents) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(priceCents / 100);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
                {/* Estilo CSS inserido aqui */}
                <style>{dashboardStyles}</style>
                <div className="customer-dashboard-wrapper">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Meus Pedidos</h2>
                    {loading ? (
                        <p className="text-center text-gray-600">Carregando pedidos...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-center text-gray-600">Você não tem pedidos.</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold">Pedido #{order.id}</h3>
                                    <span className={`text-sm font-semibold ${order.status === 'CANCELLED' ? 'text-red-500' : 'text-green-500'}`}>
                                        {order.status === 'CANCELLED' ? 'Cancelado' : 'Concluído'}
                                    </span>
                                </div>
                                <ul className="mb-4">
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex justify-between text-sm text-gray-700">
                                            <span>{item.product.name} (x{item.quantity})</span>
                                            <span>{formatPrice(item.unitCents)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total: {formatPrice(order.totalCents)}</span>
                                    {order.status === 'PLACED' && (
                                        <button 
                                            onClick={() => handleCancelOrder(order.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Cancelar Pedido
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}