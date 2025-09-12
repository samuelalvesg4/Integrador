import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getSellerSales } from "../services/api";

export default function Sales() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getSellerSales();
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert(err.body?.message || "Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Minhas Vendas</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : orders.length === 0 ? (
          <p>Nenhuma venda registrada ainda.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded">
            {/* Aqui você pode adicionar a renderização da tabela de vendas,
                usando os dados da variável `orders`. */}
          </table>
        )}
      </div>
    </div>
  );
}