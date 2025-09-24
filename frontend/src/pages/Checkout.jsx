import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { finalizarCompra } from '../services/api';

// Importa o seu arquivo CSS específico para esta página
import '../pages/checkout.css'; 

export default function Checkout() {
    const navigate = useNavigate();
    const { checkoutItems, clearCart } = useCart();
    
    // Estados do formulário e da página
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);
    
    const [checkoutStep, setCheckoutStep] = useState('details'); 
    const [paymentData, setPaymentData] = useState({});

    const subtotal = checkoutItems.reduce((acc, item) => acc + (item.priceCents || item.price * 100) * item.quantity, 0);

    useEffect(() => {
        if (checkoutItems.length === 0 && checkoutStep === 'details') {
            alert("Nenhum item selecionado para checkout.");
            navigate('/cart');
        }
    }, [checkoutItems, navigate, checkoutStep]);

    const formatPrice = (valueInCents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueInCents / 100);

    const handleCepChange = async (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCep(value);
        if (value.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setLogradouro(data.logradouro || '');
                    setBairro(data.bairro || '');
                    setCidade(data.localidade || '');
                    setEstado(data.uf || '');
                }
            } catch (err) { console.error("Erro ao buscar CEP", err); }
            finally { setLoadingCep(false); }
        }
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if ((!logradouro || !numero) || !paymentMethod) {
            return alert('Por favor, preencha o endereço completo e escolha uma forma de pagamento.');
        }
        if (paymentMethod === 'Pix') setPaymentData({ pixKey: '00020126330014br.gov.bcb.pix011112345678901' });
        else if (paymentMethod === 'Boleto') setPaymentData({ boletoNumber: '12345.67890 12345.678901 12345.678901 1 12345678901234' });
        
        setCheckoutStep('payment');
    };

    const handleConfirmPayment = async () => {
        const orderData = {
            items: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity })),
            totalCents: subtotal,
            paymentMethod,
        };
        try {
            await finalizarCompra(orderData);
            alert(`Pagamento confirmado! Pedido finalizado com sucesso!`);
            clearCart();
            navigate('/');
        } catch (err) {
            console.error("Erro ao finalizar compra:", err);
            alert(err.body?.message || "Não foi possível finalizar a compra.");
        }
    };
    
    return (
        <div className="page-container">
            <Header />
            <main className="content-wrap checkout-page">
                <h1>{checkoutStep === 'details' ? 'Finalizar Compra' : 'Realize o Pagamento'}</h1>

                {checkoutStep === 'details' ? (
                    <div className="checkout-container">
                        <div className="address-payment-forms">
                            <section className="checkout-section">
                                <h2>Endereço de Entrega</h2>
                                <form id="checkoutForm" onSubmit={handleProceedToPayment} className="address-form-grid">
                                    <div className="form-group"><label>CEP</label><input type="text" value={cep} onChange={handleCepChange} required disabled={loadingCep} /></div>
                                    <div className="form-group"><label>Rua</label><input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required /></div>
                                    <div className="form-group"><label>Bairro</label><input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required /></div>
                                    <div className="form-group"><label>Cidade</label><input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required /></div>
                                    <div className="form-group"><label>Estado</label><input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required /></div>
                                    <div className="form-group"><label>Número</label><input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required /></div>
                                    <div className="form-group full-width"><label>Complemento (Opcional)</label><input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} /></div>
                                </form>
                            </section>
                            
                            <section className="checkout-section">
                                <h2>Forma de Pagamento</h2>
                                <div className="payment-options">
                                    <label className="payment-option"><input type="radio" name="payment" value="Pix" checked={paymentMethod === 'Pix'} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Pix</span></label>
                                    <label className="payment-option"><input type="radio" name="payment" value="Cartão" checked={paymentMethod === 'Cartão'} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Cartão de Crédito</span></label>
                                    <label className="payment-option"><input type="radio" name="payment" value="Boleto" checked={paymentMethod === 'Boleto'} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Boleto Bancário</span></label>
                                </div>
                            </section>
                        </div>
                        
                        <aside className="order-summary checkout-section">
                            <h2>Resumo do Pedido</h2>
                            {checkoutItems.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>{formatPrice((item.priceCents || item.price * 100) * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="summary-total">
                                <span>Total:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <button type="submit" form="checkoutForm" className="btn btn-primary">
                                Prosseguir para Pagamento
                            </button>
                        </aside>
                    </div>
                ) : (
                    <section className="checkout-section payment-simulation-box">
                        {paymentMethod === 'Pix' && (
                            <div>
                                <h3>Pagamento com Pix</h3>
                                <p>Copie a chave Pix abaixo para realizar o pagamento:</p>
                                <div className="payment-code">{paymentData.pixKey}</div>
                                <img src="https://i.imgur.com/gsv936s.png" alt="Exemplo de QR Code" className="payment-image qr-code" />
                            </div>
                        )}
                        {/* Simulações para Boleto e Cartão */}
                        {paymentMethod === 'Boleto' && (
                           <div>
                                <h3>Pagamento com Boleto</h3>
                                <p>Use o código abaixo para pagar o boleto:</p>
                                <div className="payment-code">{paymentData.boletoNumber}</div>
                                <img src="https://i.imgur.com/qDc4s4s.png" alt="Exemplo de Código de Barras" className="payment-image barcode" />
                           </div>
                        )}
                        {paymentMethod === 'Cartão' && (
                            <div>
                                <h3>Pagamento com Cartão de Crédito</h3>
                                <p>Esta é apenas uma simulação. Clique em 'Finalizar Pedido' para confirmar.</p>
                            </div>
                        )}
                        <button onClick={handleConfirmPayment} className="btn btn-confirm">
                            Já Paguei, Finalizar Pedido
                        </button>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}