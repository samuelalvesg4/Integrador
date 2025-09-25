import { useEffect, useState } from "react";
import { uploadImages, registerProduct, editProduct } from '../services/api';
import imageCompression from 'browser-image-compression'; // Importa a biblioteca

export default function CreateProduct({ productToEdit, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [newFiles, setNewFiles] = useState([]); // Mudado para 'newFiles' para clareza
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!productToEdit;

  useEffect(() => {
    if (isEditing && productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice((productToEdit.price / 100).toFixed(2));
      setStock(productToEdit.stock);
      // Você pode exibir as imagens existentes, mas a lógica de envio já está coberta
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setNewFiles([]);
    }
  }, [productToEdit, isEditing]);
  
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const compressedFiles = [];
    for (const file of files) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });
        compressedFiles.push(compressedFile);
      } catch (error) {
        console.error("Erro na compressão da imagem:", error);
      }
    }
    setNewFiles(compressedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceInCents = Math.round(parseFloat(price) * 100);
      let updatedProduct = null;

      if (isEditing) {
        // LÓGICA DE EDIÇÃO
        const updatedData = { name, description, price: priceInCents, stock: parseInt(stock, 10) };
        updatedProduct = await editProduct(productToEdit.id, updatedData);
        alert("Produto atualizado com sucesso!");

        // Se o usuário selecionou novas imagens, faz o upload
        if (newFiles.length > 0) {
          await uploadImages(newFiles, productToEdit.id);
        }

      } else {
        // LÓGICA DE CADASTRO
        const newProductData = { name, description, price: priceInCents, stock: parseInt(stock, 10), images: [] };
        updatedProduct = await registerProduct(newProductData);
        
        // Se o usuário selecionou imagens no cadastro, faz o upload usando o ID do novo produto
        if (newFiles.length > 0) {
          await uploadImages(newFiles, updatedProduct.id);
        }

        alert("Produto cadastrado com sucesso!");
      }

      onClose(); // Fecha o modal ou componente
    } catch (error) {
      console.error("Erro no cadastro/edição:", error);
      alert("Erro: " + (error.body?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Editar Produto" : "Cadastrar Produto"}</h2>
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
          step="0.01"
          placeholder="Valor (R$)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (isEditing ? 'Atualizando...' : 'Cadastrando...') : (isEditing ? 'Atualizar' : 'Cadastrar')}
        </button>
      </form>
    </div>
  );
}