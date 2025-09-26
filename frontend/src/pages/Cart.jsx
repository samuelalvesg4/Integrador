import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from '../context/CartContext';
import { Trash2 } from "lucide-react";
import '../components/cart.css';

export default function Cart() {
    const {
        cartItems,
        updateItemQuantity,
        removeItemFromCart,
        selectedItems,
        toggleItemSelection,
        toggleSelectAll,
        startCheckout
    } = useCart();

    const [cep, setCep] = useState("");
    const [frete, setFrete] = useState(0);
    const navigate = useNavigate();

    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const subtotal = selectedCartItems.reduce((acc, item) => acc + (item.priceCents || item.price * 100) * item.quantity, 0);

    const formatPrice = (priceCents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceCents / 100);

    const calcularFrete = () => {
        // Lógica de cálculo de frete
        if (cep.length !== 8) {
            alert("Por favor, digite um CEP válido com 8 dígitos.");
            return;
        }

        // Simulação de cálculo de frete com base no número de itens
        const custoBaseFrete = 1000; // R$ 10,00
        const custoPorItem = 500; // R$ 5,00
        const novoFrete = custoBaseFrete + (selectedCartItems.length * custoPorItem);
        setFrete(novoFrete);
    };

    const handleFinalizarCompra = () => {
        if (selectedCartItems.length === 0) {
            return alert("Selecione pelo menos um item para prosseguir.");
        }
        if (frete <= 0) {
            return alert("Por favor, calcule o frete antes de finalizar a compra.");
        }
        startCheckout(selectedCartItems);
        navigate("/checkout");
    };

    const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

    return (
        <div className="page-container">
            <Header />
            <main className="content-wrap">
                <div className="cart-container">
                    <h2>Meu Carrinho</h2>
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            <h2>Seu carrinho está vazio.</h2>
                            <p>Adicione produtos para vê-los aqui.</p>
                            <Link to="/" className="btn-primary">Voltar para a Loja</Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <div className="cart-items-list">
                                {/* CORRIGIDO: Cabeçalho com alinhamento flex */}
                                <div className="cart-header">
                                    <div className="header-select-all">
                                        <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} id="selectAll" />
                                        <label htmlFor="selectAll">Produto</label>
                                    </div>
                                    <div>Preço Unit.</div>
                                    <div style={{ textAlign: 'center' }}>Qtd.</div>
                                    <div>Preço Total</div>
                                    <div style={{ textAlign: 'center' }}>Remover</div>
                                </div>
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="product-info">
                                            <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItemSelection(item.id)} />
                                            <img src={item.images && item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/150'} alt={item.name} />
                                            <span>{item.name}</span>
                                        </div>
                                        <span>{formatPrice(item.priceCents || item.price * 100)}</span>
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateItemQuantity(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateItemQuantity(item.id, 1)}
                                                // 👇 ADIÇÃO IMPORTANTE: Desabilita o botão se a quantidade no carrinho
                                                //    já for igual ou maior que o estoque do produto.
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="item-total-price">{formatPrice((item.priceCents || item.price * 100) * item.quantity)}</span>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button onClick={() => removeItemFromCart(item.id)} className="remove-button"><Trash2 size={20} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <aside className="summary-box">
                                <h2>Resumo</h2>
                                <div className="summary-row">
                                    <span>Subtotal ({selectedCartItems.length} itens)</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="frete-calculator">
                                    <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} className="cep-input" />
                                    <button onClick={calcularFrete} className="btn-cep">Calcular</button>
                                </div>
                                {frete > 0 && (
                                    <div className="summary-row"><span>Frete:</span><span>{formatPrice(frete)}</span></div>
                                )}
                                <div className="summary-row summary-total">
                                    <span>Total:</span>
                                    <span>{formatPrice(subtotal + frete)}</span>
                                </div>
                                <button onClick={handleFinalizarCompra} className="btn-checkout">Finalizar Compra</button>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}