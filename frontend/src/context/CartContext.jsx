import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Carrega o carrinho do localStorage no início
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem('cartItems');
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            console.error("Failed to load cart from localStorage", error);
            return [];
        }
    });

    // Salva o carrinho no localStorage sempre que cartItems mudar
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart to localStorage", error);
        }
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const updateItemQuantity = (id, delta) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            );
            return updatedItems.filter(item => item.quantity > 0);
        });
    };

    const removeItemFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // FUNÇÃO ADICIONADA: Limpa todos os itens do carrinho
    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart, // ADICIONADO: Exportando a nova função
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};
