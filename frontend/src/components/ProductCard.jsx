// frontend/src/components/ProductCard.jsx

import { Link } from 'react-router-dom';
import React from 'react';
import Wrapper from '../components/Wrapper';

export default function ProductCard({ product }) {
    const handleAddToCart = () => {
        alert("Produto adicionado ao carrinho!");
    };

    /**
     * @description Insere a transformação de redimensionamento na URL do Cloudinary.
     * @param {string} url A URL original da imagem do Cloudinary.
     * @returns {string} A URL da imagem transformada.
     */
    const getTransformedUrl = (url) => {
        if (!url) {
            return null;
        }

        // Parâmetros de transformação:
        // 'h_50' define a altura para 50 pixels.
        // 'c_scale' redimensiona a imagem proporcionalmente.
        const transformation = 'h_200,c_scale';

        // Separa a URL para inserir a transformação no lugar correto
        const parts = url.split('/upload/');
        
        // Retorna a URL com a transformação aplicada.
        return `${parts[0]}/upload/${transformation}/${parts[1]}`;
    };

    const imageUrl = (product.images && product.images.length > 0)
        ? getTransformedUrl(product.images[0].url)
        : null;

    return (
        <Wrapper>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
                <Link to={`/product/${product.id}`}>
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
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                            R${product.price ? product.price.toFixed(2) : 'N/A'}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
                        >
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
