import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function Checkout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cartao");

  useEffect(() => {
    const data = localStorage.getItem("checkoutData");
    if (data) setCheckoutData(JSON.parse(data));
  }, []);

  if (!checkoutData) {
    return (
      <div>
        <Header />
        <main className="p-6">
          <p>Não há dados de checkout. Volte ao carrinho.</p>
        </main>
      </div>
    );
  }

  const { cartItems, subtotal, frete, total, endereco } = checkoutData;

  const finalizarCompra = () => {
    // Aqui você poderia enviar os dados para o backend
    alert(
      `Compra finalizada!\nTotal: R$ ${total.toFixed(
        2
      )}\nForma de pagamento: ${paymentMethod}`
    );
    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutData");
    window.dispatchEvent(new Event("cartChanged"));
    window.location.href = "/";
  };

  return (
    <div>
      <Header />

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Resumo do pedido */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Resumo do Pedido</h2>
          <div className="bg-white p-4 rounded shadow space-y-2">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Frete:</span>
              <span>R$ {frete.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Endereço de entrega */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Endereço de Entrega</h2>
          <div className="bg-white p-4 rounded shadow space-y-1">
            <p>
              {endereco.logradouro}, {endereco.bairro}, {endereco.localidade} -{" "}
              {endereco.uf}
            </p>
            <p>CEP: {endereco.cep}</p>
          </div>
        </section>

        {/* Forma de pagamento */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Forma de Pagamento</h2>
          <div className="bg-white p-4 rounded shadow space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="cartao"
                checked={paymentMethod === "cartao"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cartão de Crédito/Débito</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>PIX</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="dinheiro"
                checked={paymentMethod === "dinheiro"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Dinheiro</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={finalizarCompra}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Finalizar Compra
          </button>
        </div>
      </main>
    </div>
  );
}
