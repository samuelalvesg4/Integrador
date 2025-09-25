// frontend/src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    const handleAddToCart = () => {
        alert("Produto adicionado ao carrinho!");
    };

    // CORREÇÃO: Verifica se o array de imagens existe e se tem pelo menos uma imagem
    const imageUrl = (product.images && product.images.length > 0)
        ? `http://localhost:4000${product.images[0].url}`
        : null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
            <Link to={`/product/${product.id}`}>
                {/* Visualização da Imagem */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                        <span className="text-sm">Sem Imagem</span>
                    </div>
                )}
            </Link>
            
            <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600 mt-1 font-bold">
                    R$ {product.price ? product.price.toFixed(2) : '0.00'}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <Link
                        to={`/product/${product.id}`}
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                        Ver Detalhes
                    </Link>
                    <div className="mt-2">
                    <button
                        onClick={handleAddToCart}
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                        Adicionar ao Carrinho
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
