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
        // Usando c_pad para garantir que a imagem não seja cortada e tenha um fundo
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 relative">
            
            {/* O container da imagem é um flexbox para centralizar seu conteúdo */}
            <Link to={`/product/${product.id}`} className="block h-48 flex items-center justify-center p-2">
                {imageUrl ? (
                    // A imagem em si não ocupa 100% da largura, permitindo que seja centralizada
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
            </Link>
            
            <div className="p-4 text-center">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-900 mt-1 font-bold text-xl">{formattedPrice}</p>
                
                <div className="mt-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`text-white px-4 py-2 rounded-full transition w-full ${
                            isOutOfStock 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
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