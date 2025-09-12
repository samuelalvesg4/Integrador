// frontend/src/pages/RegisterProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { registerProduct, uploadImages } from "../services/api";

export default function RegisterProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]); // Agora armazena objetos File
  const [previewUrls, setPreviewUrls] = useState([]); // Para exibir as imagens

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Cria URLs de visualização para as imagens selecionadas
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Faz o upload das imagens para o backend e obtém as URLs
      const imageUrls = await uploadImages(images);

      // 2. Cadastra o produto com as URLs das imagens
      await registerProduct(name, parseFloat(price), description, parseInt(stock), imageUrls);
      
      alert("Produto cadastrado com sucesso!");
      navigate("/MyProducts");
    } catch (err) {
      console.error(err);
      alert(err.body?.message || "Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Cadastrar Produto</h2>
          <input
            type="text"
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <input
            type="number"
            placeholder="Estoque"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-3"
            required
          />
          {/* Novo input para upload de arquivos */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          {/* Pré-visualização das imagens */}
          <div className="flex flex-wrap gap-2 mb-3">
            {previewUrls.map((url, index) => (
              <img key={index} src={url} alt={`Pré-visualização ${index + 1}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}