import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import { getSellerSales } from "../services/api";

export default function Sales() {
    useAuth({ role: 'seller' });
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await getSellerSales();
                setSales(data);
            } catch (err) {
                console.error("Erro ao buscar vendas:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    const formatPrice = (priceCents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceCents / 100);

    return (
        <div className="page-container">
            <Header />
            <main className="content-wrap">
                <div className="my-products-container"> {/* Reutilizando o container */}
                    <div className="page-header">
                        <h1>Minhas Vendas</h1>
                    </div>
                    {loading ? (
                        <p>Carregando vendas...</p>
                    ) : sales.length === 0 ? (
                        <p className="no-products-message">Você ainda não realizou nenhuma venda.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="products-table"> {/* Reutilizando a tabela */}
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Qtd.</th>
                                        <th>Preço Total</th>
                                        <th>Comprador</th>
                                        <th>Data</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map(sale => (
                                        <tr key={sale.id}>
                                            <td>{sale.product?.name || 'N/A'}</td>
                                            <td>{sale.quantity}</td>
                                            <td>{formatPrice(sale.unitCents * sale.quantity)}</td>
                                            <td>{sale.order?.customer?.user?.name || 'N/A'}</td>
                                            <td>{new Date(sale.order?.createdAt).toLocaleDateString()}</td>
                                            <td className={sale.order?.status === 'CANCELLED' ? 'status-cancelled' : 'status-completed'}>
                                                {sale.order?.status === 'CANCELLED' ? 'Cancelada' : 'Concluída'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}