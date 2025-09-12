import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getSellerProducts } from "../services/api";
import useAuth from "../hooks/useAuth";

export default function MyProducts() {
  const { user, loading: userLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getSellerProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert(err.body?.message || "Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    // CORREÇÃO: Checa se há uma data de atualização no localStorage
    const productsUpdated = localStorage.getItem('productsUpdated');
    if (productsUpdated) {
        setLoading(true);
        fetchProducts();
        // Remove a data para não acionar a busca em loop
        localStorage.removeItem('productsUpdated');
    } else {
        fetchProducts();
    }
    
  }, []); // A matriz de dependência permanece vazia para a primeira renderização

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Meus Produtos</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : products.length === 0 ? (
          <p>Você ainda não cadastrou produtos.</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="border px-4 py-2">Nome</th>
                <th className="border px-4 py-2">Preço</th>
                <th className="border px-4 py-2">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">
                    R$ {p.price.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}