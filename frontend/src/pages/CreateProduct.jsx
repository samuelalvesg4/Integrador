import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image);

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Produto cadastrado com sucesso!");
      navigate("/"); // volta para home
      window.dispatchEvent(new Event("productAdded")); // para atualizar Home automaticamente
    } else {
      alert("Erro ao cadastrar produto: " + data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Produto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantidade em estoque"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
