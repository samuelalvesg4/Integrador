import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) { return []; }
    });

    const [selectedItems, setSelectedItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        const items = localData ? JSON.parse(localData) : [];
        return items.map(item => item.id);
    });

    // --- NOVO ESTADO APENAS PARA O CHECKOUT ---
    const [checkoutItems, setCheckoutItems] = useState([]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
    // A validação principal acontece antes de qualquer outra coisa
    const itemInCart = cartItems.find((item) => item.id === product.id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (currentQuantityInCart >= product.stock) {
        alert("Você já adicionou a quantidade máxima em estoque para este item.");
        return; // Impede a adição do item
    }

    setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
            return prevItems.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            setSelectedItems(prevSelected => [...prevSelected, product.id]);
            return [...prevItems, { ...product, quantity: 1 }];
        }
    });
};
    
    const removeItemFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setSelectedItems(prevSelected => prevSelected.filter(itemId => itemId !== id));
    };

    const clearCart = () => {
        // Agora, clearCart limpa o carrinho principal, não os itens do checkout.
        const itemsToRemove = cartItems.filter(item => selectedItems.includes(item.id));
        const newCartItems = cartItems.filter(item => !selectedItems.includes(item.id));
        setCartItems(newCartItems);
        setSelectedItems([]);
        setCheckoutItems([]);
    };

    const toggleItemSelection = (productId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    };
    
    // --- NOVA FUNÇÃO PARA INICIAR O CHECKOUT DE FORMA SEGURA ---
    const startCheckout = (itemsToCheckout) => {
        setCheckoutItems(itemsToCheckout);
    };

    // ... (função updateItemQuantity sem alteração)
    const updateItemQuantity = (id, delta) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            );
        });
    };


    const value = {
        cartItems,
        addToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        selectedItems,
        toggleItemSelection,
        toggleSelectAll,
        // --- EXPOR NOVOS VALORES ---
        checkoutItems,
        startCheckout,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};