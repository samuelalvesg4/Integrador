import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext'; 

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
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateItemQuantity(item.id, -1)}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateItemQuantity(item.id, 1)}
                    className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>

                  <span className="ml-4">{item.name}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end font-bold text-lg">
              Subtotal: R$ {subtotal.toFixed(2)}
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                placeholder="CEP para calcular frete"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                onClick={calcularFrete}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Calcular Frete
              </button>
              {frete > 0 && <span>Frete: R$ {frete.toFixed(2)}</span>}
            </div>

            {frete > 0 && (
              <div className="flex justify-end font-bold text-lg mt-2">
                Total: R$ {(subtotal + frete).toFixed(2)}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={finalizarCompra}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
