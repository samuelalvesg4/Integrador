import { useEffect, useState } from "react";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { getSellerSales } from "../services/api";
import '../components/my-products.css';

export default function Sales() {
    useAuth();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await getSellerSales();
                setSales(data);
            } catch (err) {
                console.error("Erro ao buscar vendas:", err);
                alert(err?.body?.message || "Erro de conexão com o servidor.");
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    // Função para formatar o preço em BRL
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
                {/* Usando a mesma classe CSS */}
                <div className="my-products-wrapper">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Minhas Vendas</h2>

                    {loading ? (
                        <p className="text-center text-gray-600">Carregando vendas...</p>
                    ) : sales.length === 0 ? (
                        <p className="text-center text-gray-600">
                            Você ainda não realizou nenhuma venda.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="products-table">
                                <thead className="products-table-header">
                                    <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unitário</th>
                                        <th>Preço Total</th>
                                        <th>Comprador</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => (
                                        <tr key={sale.id} className="products-table-row">
                                            <td>{sale.product.name}</td>
                                            <td>{sale.quantity}</td>
                                            <td>{formatPrice(sale.unitCents)}</td>
                                            <td>{formatPrice(sale.unitCents * sale.quantity)}</td>
                                            <td>{sale.order.customer.user.name}</td>
                                            <td>{new Date(sale.order.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
