import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { finalizarCompra } from '../services/api';
import './checkout.css';

export default function Checkout() {
    const navigate = useNavigate();
    const { checkoutItems: cartItems, clearCart } = useCart();
    
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loadingCep, setLoadingCep] = useState(false);
    const [frete, setFrete] = useState(0);
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.priceCents || item.price * 100) * item.quantity, 0);

    useEffect(() => {
        if ((cartItems.length === 0)) {
            alert("Nenhum item selecionado para checkout. Redirecionando para Home.");
            navigate('/');
        }
    }, [cartItems, navigate]);

    const generateRandomPixKey = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    const generateFakeBoletoNumber = () => {
        let number = '';
        for (let i = 0; i < 48; i++) {
            number += Math.floor(Math.random() * 10);
            if ([4, 9, 14, 19, 24, 29, 34, 39, 43].includes(i)) number += ' ';
        }
        return number;
    };

    const handleCepChange = async (e) => {
        const newCep = e.target.value.replace(/\D/g, '');
        setCep(newCep);
        if (newCep.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${newCep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setLogradouro(data.logradouro);
                    setBairro(data.bairro);
                    setCidade(data.localidade);
                    setEstado(data.uf);
                    
                    // Lógica de frete do carrinho
                    const custoBaseFrete = 1000;
                    const custoPorItem = 500;
                    const novoFrete = custoBaseFrete + (cartItems.length * custoPorItem);
                    setFrete(novoFrete);
                } else {
                    alert('CEP não encontrado.');
                    setFrete(0); // Reseta o frete se o CEP não for válido
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                setFrete(0);
            } finally {
                setLoadingCep(false);
            }
        } else {
            setLogradouro('');
            setBairro('');
            setCidade('');
            setEstado('');
            setFrete(0); // Reseta o frete
        }
    };
    
    const handleFinalizarCompra = async (e) => {
        e.preventDefault();
        if ((!logradouro || !numero) || !paymentMethod) {
            alert('Por favor, preencha o endereço completo e escolha uma forma de pagamento.');
            return;
        }

        const orderData = {
            items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
            totalCents: subtotal + frete,
            paymentMethod: paymentMethod,
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

        const calcularFrete = () => {
        if (cep.length !== 8) {
            alert("Por favor, digite um CEP válido com 8 dígitos.");
            return;
        }

        const custoBaseFrete = 1000;
        const custoPorItem = 500;
        const novoFrete = custoBaseFrete + (cartItems.length * custoPorItem);
        setFrete(novoFrete);
        alert(`Frete calculado com sucesso: R$ ${novoFrete / 100}`);
    };
    
    return (
        <div>
            <Header />
            <main className="checkout-page">
                <h2>Finalizar Compra</h2><br/>

                {cartItems.length === 0 ? (
                    <p>Nenhum item selecionado para Finalização. Redirecionando para a Home.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 checkout-container">
                        <section className="checkout-section">
                        <aside className="order-summary checkout-section">
    <h2>Resumo do Pedido</h2>
    {cartItems.map((item) => (
        <div key={item.id} className="summary-item">
            <span>{item.name} (x{item.quantity})</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((item.priceCents || item.price * 100) * item.quantity / 100)}</span>
        </div>
    ))}
    {frete > 0 && (
        <div className="summary-item">
            <span>Frete:</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(frete / 100)}</span>
        </div>
    )}
    <div className="summary-total">
        <span>Total:</span>
        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((subtotal + frete) / 100)}</span>
    </div>
</aside>
                            <form onSubmit={handleFinalizarCompra} className='address-form'>
                            <h2>Endereço de Entrega</h2><br/>
                                <div className="address-form-grid">
                                <div className="form-group"> <label>CEP</label> <input type="text" value={cep} onChange={handleCepChange} required disabled={loadingCep}/></div>
                                    <div className="form-group"><label>Rua</label><input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required /></div>
                                    <div className="form-group"><label>Bairro</label><input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required /></div>
                                    <div className="form-group"><label>Cidade</label><input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required /></div>
                                    <div className="form-group"><label>Estado</label><input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required /></div>
                                    <div className="form-group"><label>Número</label><input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required /></div>
                                    <div className="form-group full-width"><label>Complemento</label><input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} /></div>
                                </div>
                                <div className="mt-4">
                                    <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-full w-full font-bold hover:bg-green-700">
                                        Finalizar Compra
                                    </button>
                                </div>
                            </form>

                        </section>
                        
                        <section className="checkout-section">
                            <h2>Forma de Pagamento</h2><br/>
                            <div className="payment-options flex flex-wrap gap-4">
                                <div>
                                    <label className="payment-option"><input type="radio" name="payment" value="Pix" checked={paymentMethod === 'Pix'} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Pix</span></label>
                                    {paymentMethod === 'Pix' && (
                                        <div className="payment-details-box mt-4">
                                            <h3>Pagamento com Pix</h3>
                                            <p>Copie a chave Pix abaixo para realizar o pagamento:</p>
                                            <div className="payment-code">{generateRandomPixKey()}</div>
                                            {/* {<img src="https://i.imgur.com/gsv936s.png" alt="Exemplo de QR Code" className="payment-image qr-code" />} */}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="payment-option"><input type="radio" name="payment" value="Boleto" checked={paymentMethod === 'Boleto'} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Boleto Bancário</span></label>
                                    {paymentMethod === 'Boleto' && (
                                        <div className="payment-details-box mt-4">
                                            <h3>Pagamento com Boleto</h3>
                                            <p>Use o código abaixo para pagar o boleto:</p>
                                            <div className="payment-code">{generateFakeBoletoNumber()}</div>
                                            {/* {<img src="https://i.imgur.com/qDc4s4s.png" alt="Exemplo de Código de Barras" className="payment-image barcode" />} */}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="payment-option"><input type="radio" name="payment" value="Cartão" checked={paymentMethod === 'Cartão'} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Cartão de Crédito</span></label>
                                    {paymentMethod === 'Cartão' && (
                                        <div className="payment-details-box mt-4">
                                            <h3>Pagamento com Cartão de Crédito</h3>
                                            <p>Preencha os dados abaixo. (Não use dados reais).</p>
                                            <div className="address-form-grid" style={{marginTop: '1.5rem'}}>
                                                <div className="form-group full-width"><input type="text" placeholder="Número do Cartão (ex: 4242 4242 4242 4242)" /></div>
                                                <div className="form-group full-width"><input type="text" placeholder="Nome no Cartão" /></div>
                                                <div className="form-group"><input type="text" placeholder="Validade (MM/AA)" /></div>
                                                <div className="form-group"><input type="text" placeholder="CVV" /></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}