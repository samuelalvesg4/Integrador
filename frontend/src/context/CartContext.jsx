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
        return items.map(item => item.id); // Inicia com todos selecionados
    });

    const [checkoutItems, setCheckoutItems] = useState([]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        const itemInCart = cartItems.find((item) => item.id === product.id);
        const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

        if (currentQuantityInCart >= product.stock) {
            alert("Você já adicionou a quantidade máxima em estoque para este item.");
            return;
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Ao adicionar um novo item, ele também é selecionado automaticamente
                setSelectedItems(prevSelected => [...prevSelected, product.id]);
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };
    
    // --- FUNÇÃO CORRIGIDA ---
    // Agora, ela impede que o usuário adicione mais itens do que o estoque permite
    const updateItemQuantity = (id, delta) => {
        setCartItems((prevItems) => {
            const itemToUpdate = prevItems.find((item) => item.id === id);
            if (!itemToUpdate) return prevItems;

            const newQuantity = itemToUpdate.quantity + delta;

            // Validação de estoque
            if (delta > 0 && newQuantity > itemToUpdate.stock) {
                alert(`Estoque máximo para ${itemToUpdate.name} é ${itemToUpdate.stock}.`);
                return prevItems; // Não faz a alteração
            }

            return prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
            );
        });
    };

    const removeItemFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setSelectedItems(prevSelected => prevSelected.filter(itemId => itemId !== id));
    };

    // --- FUNÇÃO CORRIGIDA ---
    // Garante que apenas os itens finalizados na compra sejam removidos do carrinho principal.
    const clearCart = () => {
        const purchasedIds = checkoutItems.map(item => item.id);
        setCartItems(prevItems => prevItems.filter(item => !purchasedIds.includes(item.id)));
        setSelectedItems(prevSelected => prevSelected.filter(id => !purchasedIds.includes(id)));
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
    
    const startCheckout = (itemsToCheckout) => {
        setCheckoutItems(itemsToCheckout);
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
        checkoutItems,
        startCheckout,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};