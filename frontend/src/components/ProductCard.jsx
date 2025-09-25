// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

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
    const { addToCart, cartItems } = useCart()

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

    // Encontra o item específico no carrinho
    const itemInCart = cartItems.find(item => item.id === product.id);
    // Pega a quantidade que já está no carrinho, ou 0 se não estiver
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    // ALTERADO: A nova lógica para verificar se está esgotado
    const isOutOfStock = product.stock <= 0 || quantityInCart >= product.stock;

    return (
        <div>
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
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                // NOVO: Classes de estilo para um botão mais moderno
                                className={`product-bt 
        flex items-center justify-center w-full gap-2 px-4 py-2 font-bold text-white transition-all duration-200 rounded-lg shadow-md
        ${isOutOfStock
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transform hover:-translate-y-0.5'
                                    }
    `}
                            >
                                {/* NOVO: Adiciona um ícone ao lado do texto */}
                                {!isOutOfStock && <ShoppingCart size={16} />}
                                <span>
                                    {isOutOfStock ? 'Esgotado' : 'Adicionar'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- A MÁGICA DA NOTIFICAÇÃO --- */}
                <div className={`product-card-notification ${showNotification ? 'show' : ''}`}>
                    Adicionado! ✔️
                </div>
            </div>
        </div>
    );
}