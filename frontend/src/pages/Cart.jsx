import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import '../components/cart.css'; // Certifique-se que o CSS está sendo importado

export default function Cart() {
    // Pegando todos os dados e funções do nosso context atualizado
    const { 
    cartItems, 
    updateItemQuantity, 
    removeItemFromCart,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
    startCheckout // <-- Adicione esta linha
} = useCart();

    const [cep, setCep] = useState("");
    const [frete, setFrete] = useState(0);
    const [endereco, setEndereco] = useState(null);
    const navigate = useNavigate();

    // 1. Criamos uma lista APENAS com os itens que estão selecionados
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

    // 2. O subtotal agora é calculado com base na lista de itens selecionados
    const subtotal = selectedCartItems.reduce((acc, item) => acc + (item.priceCents || item.price * 100) * item.quantity, 0);

    const formatPrice = (priceCents) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(priceCents / 100);
    };

    const calcularFrete = async () => {
        if (!cep) return alert("Informe o CEP");
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                alert("CEP inválido");
                return;
            }
            setEndereco(data);
            let valorFrete = 0;
            switch (data.uf) {
                case "SP": valorFrete = 1000; break; // Valores em centavos
                case "RJ": valorFrete = 1200; break;
                case "MG": valorFrete = 1400; break;
                default: valorFrete = 2000;
            }
            setFrete(valorFrete);
        } catch (err) {
            console.error("Erro ao consultar CEP:", err);
            alert("Erro ao calcular frete");
        }
    };

    // 3. A finalização da compra valida e envia APENAS os itens selecionados
    const finalizarCompra = () => {
        if (selectedCartItems.length === 0) {
            return alert("Selecione pelo menos um item para prosseguir.");
        }
        if (!cep || !endereco) {
            return alert("Por favor, calcule o frete com um CEP válido.");
        }
        
        // --- MUDANÇA PRINCIPAL ---
        // Troque a linha do localStorage.setItem por esta:
        startCheckout(selectedCartItems);
        
        navigate("/checkout");
    };

    // Variável para saber se o checkbox "Selecionar Todos" deve estar marcado
    const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    return (
        <div>
            <Header />
            <main className="cart-page">
                {cartItems.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    <div className="cart-wrapper">
                        <div className="cart-header">
                        <h1>Meu Carrinho</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input 
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                                <span>Produto</span>
                            </div>
                            <div>Preço Unitário</div>
                            <div style={{ textAlign: 'center' }}>Quantidade</div>
                            <div>Preço Total</div>
                            <div style={{ textAlign: 'center' }}>Ações</div>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item cart-grid">
                                <div className="product-info">
                                    <input 
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => toggleItemSelection(item.id)}
                                    />
                                    {item.images && item.images.length > 0 ? (
                                        <img src={item.images[0].url} alt={item.name} />
                                    ) : (
                                        <div className="placeholder-image" style={{ width: '80px', height: '80px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#888' }}>Sem Imagem</span>
                                        </div>
                                    )}
                                    <span>{item.name}</span>
                                </div>
                                
                                <span>{formatPrice(item.priceCents || item.price * 100)}</span>

                                <div className="quantity-controls">
                                    <button onClick={() => updateItemQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateItemQuantity(item.id, 1)}>+</button>
                                </div>

                                <span>{formatPrice((item.priceCents || item.price * 100) * item.quantity)}</span>

                                <button onClick={() => removeItemFromCart(item.id)} className="remove-button">
                                    Remover
                                </button>
                            </div>
                        ))}

                        <div className="summary-container">
                            <div className="summary-box">
                                <div className="summary-row">
                                    <span>Subtotal (selecionados):</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="CEP"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        className="cep-input"
                                    />
                                    <button onClick={calcularFrete} className="btn-cep">
                                        Calcular Frete
                                    </button>
                                </div>
                                
                                {frete > 0 && (
                                    <div className="summary-row" style={{ marginTop: '1rem' }}>
                                        <span>Frete:</span>
                                        <span>{formatPrice(frete)}</span>
                                    </div>
                                )}
                                
                                <div className="summary-row summary-total">
                                    <span>Total:</span>
                                    <span>{formatPrice(subtotal + frete)}</span>
                                </div>
                                
                                <button onClick={finalizarCompra} className="btn-checkout">
                                    Finalizar Compra
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}