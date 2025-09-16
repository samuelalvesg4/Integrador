import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded cursor-pointer hover:shadow-md">
      <img
        src={product.imageUrl || product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
        onClick={() => navigate(`/product/${product.id}`)}
      />
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p className="text-gray-700">R$ {(product.price / 100).toFixed(2)}</p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // evita ir para página de detalhe
          addItem(product);
        }}
        className="bg-blue-600 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
}
