// frontend/pages/MyProducts.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getSellerProducts, deleteProduct } from "../services/api";
import useAuth from "../hooks/useAuth";

export default function MyProducts() {
  useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getSellerProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert(err?.body?.message || "Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    const productsUpdated = localStorage.getItem("productsUpdated");
    if (productsUpdated) {
      setLoading(true);
      fetchProducts();
      localStorage.removeItem("productsUpdated");
    } else {
      fetchProducts();
    }
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Produto deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar o produto:", err);
      alert(err?.body?.error || "Ocorreu um erro ao tentar deletar o produto.");
    }
  };
  
  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Container interno independente do Header */}
      <div className="w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Meus Produtos</h2>

          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">
              Você ainda não cadastrou produtos.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full w-full text-sm text-left text-gray-500 border border-gray-200 border-collapse">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 sm:px-6 border border-gray-200">Nome</th>
                    <th className="py-3 px-4 sm:px-6 border border-gray-200">Preço</th>
                    <th className="py-3 px-4 sm:px-6 border border-gray-200">Estoque</th>
                    <th className="py-3 px-4 sm:px-6 border border-gray-200 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="bg-white hover:bg-gray-50">
                      <td className="py-4 px-4 sm:px-6 border border-gray-200 font-medium text-gray-900">{p.name}</td>
                      <td className="py-4 px-4 sm:px-6 border border-gray-200">R$ {(p.priceCents / 100).toFixed(2)}</td>
                      <td className="py-4 px-4 sm:px-6 border border-gray-200">{p.stock}</td>
                      <td className="py-4 px-4 sm:px-6 border border-gray-200 text-center flex justify-center gap-4">
                        {/* Botão de Editar */}
                        <button
                          onClick={() => handleEdit(p.id)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                        {/* Botão de Deletar */}
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Deletar
                        </button>
                      </td>
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