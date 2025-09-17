// frontend/src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import React from 'react';
import Wrapper from '../components/Wrapper';

export default function ProductCard({ product }) {
    const handleAddToCart = () => {
        alert("Produto adicionado ao carrinho!");
    };

    const imageUrl = (product.images && product.images.length > 0)
        ? `http://localhost:4000${product.images[0].url}`
        : null;

    // A CORREÇÃO É AQUI: Use Intl.NumberFormat para formatar o preço
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price || 0); // O `|| 0` garante que a formatação não falhe se o preço for nulo ou indefinido

    return (
        <Wrapper>
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
                {/* Exiba o preço formatado aqui */}
                <p className="text-gray-600 mt-1 font-bold">
                    {formattedPrice}
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
        </Wrapper>
    );
}
