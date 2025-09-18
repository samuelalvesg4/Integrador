// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    // Usando o hook useCart para acessar a função de adicionar ao carrinho
    const { addToCart } = useCart();

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
        // 'h_200' define a altura para 200 pixels.
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

    // A CORREÇÃO É AQUI: Use Intl.NumberFormat para formatar o preço
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.price || 0);

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
                        <div>
                            {/* O botão "Adicionar ao Carrinho" agora usa a função addToCart do contexto */}
                            <button
                                onClick={() => addToCart(product)}
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
