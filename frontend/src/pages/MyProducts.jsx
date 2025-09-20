import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getSellerProducts, deleteProduct } from "../services/api";
import useAuth from "../hooks/useAuth";
import CreateProduct from "./CreateProduct";
import '../components/my-products.css';

export default function MyProducts() {
  useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  
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

  useEffect(() => {
    fetchProducts();
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
  
  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
        {/* Usando a nova classe CSS */}
        <div className="my-products-wrapper">
          {/* Título */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Painel do Vendedor</h2>

          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">
              Você ainda não cadastrou produtos.
            </p>
          ) : (
            <div className="overflow-x-auto">
              {/* Usando as novas classes CSS */}
              <table className="products-table">
                <thead className="products-table-header">
                  <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="products-table-row">
                      <td>{p.name}</td>
                      <td>R$ {(p.priceCents / 100).toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td className="action-buttons-container">
                        <button
                          onClick={() => handleEdit(p)}
                          className="edit-button"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="delete-button"
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
      
      {editingProduct && (
        <Modal onClose={handleCloseModal}>
          <CreateProduct productToEdit={editingProduct} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
