import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import '../components/cart.css';

export default function Cart() {
  const { cartItems, updateItemQuantity, removeItemFromCart } = useCart();
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(0);
  const [endereco, setEndereco] = useState(null);
  const navigate = useNavigate();

  // The state management is now handled by the context, so we remove the localStorage logic
  // and the useEffect that listens for "cartChanged" event.

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate shipping via CEP
  const calcularFrete = async () => {
    if (!cep) return alert("Informe o CEP");

    try {
      // ViaCEP query
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert("CEP inválido");
        return;
      }

      setEndereco(data);

      // Simple example of shipping cost per state
      let valorFrete = 0;
      switch (data.uf) {
        case "SP":
          valorFrete = 10;
          break;
        case "RJ":
          valorFrete = 12;
          break;
        case "MG":
          valorFrete = 14;
          break;
        default:
          valorFrete = 20;
      }

      setFrete(valorFrete);
    } catch (err) {
      console.error("Erro ao consultar CEP:", err);
      alert("Erro ao calcular frete");
    }
  };

  // Finalize purchase
  const finalizarCompra = () => {
    if (cartItems.length === 0) return alert("Carrinho vazio");
    if (!cep || !endereco) return alert("Informe um CEP válido");

    const checkoutData = {
      cartItems,
      subtotal,
      frete,
      total: subtotal + frete,
      endereco,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/checkout"); // Redirect to the address/payment page
  };

  return (
    <div>
      <Header />

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Carrinho</h1>
        
        {cartItems.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <div className="cart-wrapper">
            {/* Cabeçalho da tabela */}
            <div className="cart-grid cart-header">
                <div>Produtos</div>
                <div>Preço Unitário</div>
                <div>Quantidade</div>
                <div>Preço Total</div>
                <div>Ações</div>
            </div>

            {/* Itens do carrinho */}
            {cartItems.map((item, index) => (
              <div key={item.id} className="cart-grid cart-item">
                {/* Produto */}
                <div className="product-info">
                    {/* Imagem do produto */}
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt={item.name} />
                    ) : (
                        <div className="bg-gray-200 w-20 h-20 flex items-center justify-center text-gray-500 rounded">
                            Sem Imagem
                        </div>
                    )}
                    <span>{item.name}</span>
                </div>
                
                {/* Preço Unitário */}
                <span>R$ {item.price.toFixed(2)}</span>

                {/* Quantidade */}
                <div className="quantity-controls">
                  <button onClick={() => updateItemQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItemQuantity(item.id, 1)}>+</button>
                </div>

                {/* Preço Total por item */}
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>

                {/* Botão de Ações */}
                <button
                  onClick={() => removeItemFromCart(item.id)}
                  className="remove-button"
                >
                  Remover
                </button>
              </div>
            ))}

            {/* Seção de Resumo (Subtotal e Frete) */}
            <div className="summary-container">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                    <input
                        type="text"
                        placeholder="CEP"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={calcularFrete}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Calcular Frete
                    </button>
                </div>
                
                {frete > 0 && (
                    <div className="summary-row mt-2">
                        <span>Frete:</span>
                        <span>R$ {frete.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="summary-row summary-total">
                    <span>Total:</span>
                    <span>R$ {(subtotal + frete).toFixed(2)}</span>
                </div>
                
                <div className="mt-4 text-center">
                    <button
                        onClick={finalizarCompra}
                        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 w-full"
                    >
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
