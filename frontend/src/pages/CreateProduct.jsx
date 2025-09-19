import { useEffect, useState } from "react";
import { uploadImages, registerProduct, editProduct } from '../services/api';

export default function CreateProduct({ productToEdit, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!productToEdit;

  useEffect(() => {
    if (isEditing) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice((productToEdit.priceCents / 100).toFixed(2));
      setStock(productToEdit.stock);
      // CORREÇÃO: Adicionada verificação de segurança antes de usar 'map'
      setExistingImages(productToEdit.images?.map(img => img.url) || []);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setNewImages([]);
      setExistingImages([]);
    }
  }, [productToEdit, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];

      if (newImages.length > 0) {
        const uploadedImages = await uploadImages(newImages);
        imageUrls = uploadedImages.imageUrls;
      } else if (isEditing) {
        imageUrls = existingImages;
      }
      
      const priceInCents = Math.round(parseFloat(price) * 100);
      const productData = {
        name,
        description,
        price: priceInCents,
        stock: parseInt(stock, 10),
        images: imageUrls,
      };

      if (isEditing) {
        await editProduct(productToEdit.id, productData);
        alert("Produto atualizado com sucesso!");
      } else {
        await registerProduct(productData);
        alert("Produto cadastrado com sucesso!");
      }

      onClose();
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
          placeholder="Valor (R$)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImages(Array.from(e.target.files))}
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
