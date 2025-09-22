// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import { useCart } from '../context/CartContext';

// Adicione este CSS no final do seu index.css ou crie um ProductCard.css
const notificationStyles = `
.product-card-notification {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #28a745; /* Verde sucesso */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 9999px; /* Formato de pílula */
    font-size: 0.875rem;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none; /* Não interfere com cliques */
}

.product-card-notification.show {
    opacity: 1;
    transform: translateX(-50%) translateY(-10px);
}
`;

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    // --- NOVO ESTADO PARA CONTROLAR A NOTIFICAÇÃO ---
    const [showNotification, setShowNotification] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);

        // Mostra a notificação e a esconde após 2 segundos
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 2000);
    };

    const getTransformedUrl = (url) => {
        if (!url) return null;
        const transformation = 'h_200,c_scale';
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/${transformation}/${parts[1]}`;
    };

    const imageUrl = (product.images && product.images.length > 0)
        ? getTransformedUrl(product.images[0].url)
        : null;

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.priceCents / 100 || 0); // Use priceCents

    // Verifica se o produto está sem estoque
    const isOutOfStock = product.stock <= 0;

    return (
        <Wrapper>
            {/* Adicionando a tag de estilo diretamente para simplificar */}
            <style>{notificationStyles}</style>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 relative">
                <Link to={`/product/${product.id}`}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                            <span className="text-sm">Sem Imagem</span>
                        </div>
                    )}
                </Link>
                
                <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                    <p className="text-gray-600 mt-1 font-bold">{formattedPrice}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <button
                                // A função agora é a nossa nova 'handleAddToCart'
                                onClick={handleAddToCart}
                                // --- MUDANÇA PRINCIPAL: DESABILITA O BOTÃO SE ESTIVER FORA DE ESTOQUE ---
                                disabled={isOutOfStock}
                                // Muda a cor e o texto do botão se estiver esgotado
                                className={`text-white text-sm px-3 py-1 rounded transition ${
                                    isOutOfStock 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- A MÁGICA DA NOTIFICAÇÃO --- */}
                <div className={`product-card-notification ${showNotification ? 'show' : ''}`}>
                    Adicionado! ✔️
                </div>
            </div>
        </Wrapper>
    );
}