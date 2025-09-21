import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { finalizarCompra } from '../services/api';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();

    // Estados do formulário
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const [loadingCep, setLoadingCep] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Carrega dados do carrinho
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    // Lógica para buscar o endereço via CEP
    const handleCepChange = async (e) => {
        const newCep = e.target.value;
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
                } else {
                    alert('CEP não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            } finally {
                setLoadingCep(false);
            }
        }
    };

    // Lógica para simular a finalização da compra
    const handleFinalizarCompra = async (e) => {
        e.preventDefault();
        // if (!logradouro || !numero || !paymentMethod) {
        //     alert('Por favor, preencha o endereço completo e escolha uma forma de pagamento.');
        //     return;
        // }

        const orderData = {
            items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            name: item.name
            })),
            totalCents: subtotal,
            paymentMethod: paymentMethod, // <-- ADICIONE ESTA LINHA
        };

        // --- NOSSOS TESTES ---
        console.log("1. PREPARANDO PARA ENVIAR PEDIDO...");
        console.log("Dados que serão enviados:", orderData);
        // ---------------------

        try {
            console.log("2. CHAMANDO a função createOrder...");
            await finalizarCompra(orderData);

            alert(`Pedido finalizado com sucesso!`);
            clearCart();
            navigate('/');

        } catch (err) {
            console.error("3. ERRO na chamada da API:", err);
            alert(err.body?.message || "Não foi possível finalizar a compra.");
        }
    };

    const handleTestApi = async () => {
    console.log("--- TESTE DE API INICIADO ---");
    try {
      // Vamos enviar dados mínimos só para testar a conexão
      const testData = {
        items: [{ id: 1, quantity: 1 }], // Use um ID de produto que exista no seu DB
        totalCents: 1000,
      };
      console.log("Enviando dados de teste:", testData);
      
      // Use o nome da sua função aqui: finalizarCompra ou createOrder
      await finalizarCompra(testData); 
      
      console.log("--- TESTE DE API: SUCESSO ---");
      alert("TESTE: A API respondeu com sucesso!");

    } catch (error) {
      console.error("--- TESTE DE API: ERRO ---", error);
      alert("TESTE: A API respondeu com um erro. Verifique o console e a aba Rede.");
    }
  };

    return (
        <div>
            <Header />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

                <form onSubmit={handleFinalizarCompra}>
                    {/* Resumo do Pedido */}
                    <div className="bg-gray-100 p-4 rounded-md mb-6">
                        <h2 className="text-xl font-semibold mb-2">Resumo do Pedido</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm mb-1">
                                <span>{item.name} ({item.quantity})</span>
                                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                            <span>Total:</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Formulário de Endereço */}
                    <div className="bg-white p-6 rounded-md shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">CEP</label>
                                <input
                                    type="text"
                                    value={cep}
                                    onChange={handleCepChange}
                                    className="border p-2 rounded w-full"
                                    required
                                    disabled={loadingCep}
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Rua</label>
                                <input
                                    type="text"
                                    value={logradouro}
                                    onChange={(e) => setLogradouro(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Bairro</label>
                                <input
                                    type="text"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Cidade</label>
                                <input
                                    type="text"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Estado</label>
                                <input
                                    type="text"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Número</label>
                                <input
                                    type="text"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="border p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block mb-1">Complemento</label>
                                <input
                                    type="text"
                                    value={complemento}
                                    onChange={(e) => setComplemento(e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Forma de Pagamento */}
                    <div className="bg-white p-6 rounded-md shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
                        <div className="space-y-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Pix"
                                    checked={paymentMethod === 'Pix'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Pix</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Cartão"
                                    checked={paymentMethod === 'Cartão'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Cartão de Crédito</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Boleto"
                                    checked={paymentMethod === 'Boleto'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>Boleto Bancário</span>
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded-full w-full font-bold hover:bg-green-700"
                    >
                        Finalizar Compra
                    </button>
                    {/* --- BOTÃO DE TESTE ADICIONADO AQUI --- */}
        <button
          onClick={handleTestApi}
          className="bg-orange-500 text-white px-6 py-3 rounded-full w-full font-bold hover:bg-orange-600 mt-4"
        >
          TESTAR API DIRETAMENTE
        </button>
        {/* ------------------------------------ */}
                </form>
            </main>
        </div>
    );
}
