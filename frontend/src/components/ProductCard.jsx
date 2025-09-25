// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart, cartItems } = useCart();
    const [showNotification, setShowNotification] = useState(false);

    const handleAddToCart = () => {
        const addedSuccessfully = addToCart(product);
        if (addedSuccessfully) {
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
            }, 2000);
        }
    };

    const getTransformedUrl = (url) => {
        if (!url) return null;
        const transformation = 'w_200,h_200,c_pad,b_auto'; 
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/${transformation}/${parts[1]}`;
    };

    const imageUrl = (product.images && product.images.length > 0)
        ? getTransformedUrl(product.images[0].url)
        : null;

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.priceCents / 100 || 0);

    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    const isOutOfStock = product.stock <= quantityInCart;

    return (
        // ESTRUTURA DO CARD CORRIGIDA
        <div className="product-card-container bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:-translate-y-2 relative h-full flex flex-col">
            
            <Link to={`/product/${product.id}`} className="block">
                {/* Container da imagem com altura fixa */}
                <div className="h-48 flex items-center justify-center p-2">
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain" 
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
                            <span className="text-sm">Sem Imagem</span>
                        </div>
                    )}
                </div>
            </Link>
            
            {/* Esta div agora usa flexbox para crescer e empurrar o botão para baixo */}
            <div className="p-4 flex flex-col flex-grow text-center">
                {/* O Título com line-clamp para cortar o texto em 2 linhas */}
                <h3 className="text-lg font-semibold line-clamp-2 h-14">
                    {product.name}
                </h3>
                
                <p className="text-gray-900 mt-2 font-bold text-xl">
                    {formattedPrice}
                </p>
                
                {/* 'mt-auto' é a mágica que empurra o botão para o final do espaço disponível */}
                <div className="mt-auto pt-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`text-white px-4 py-2 rounded-full transition w-full font-bold ${
                            isOutOfStock 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-orange-500 hover:bg-orange-600' // Corrigido para laranja
                        }`}
                    >
                        {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>

            <div className={`product-card-notification ${showNotification ? 'show' : ''}`}>
                Adicionado! ✔️
            </div>
        </div>
    );
}