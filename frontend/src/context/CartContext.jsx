import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Verifica se o produto já está no carrinho
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                // Se sim, aumenta a quantidade
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Se não, adiciona o novo produto com quantidade 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const value = {
        cartItems,
        addToCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};