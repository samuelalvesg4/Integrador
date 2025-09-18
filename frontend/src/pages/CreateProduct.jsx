// frontend/pages/CreateProduct.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImages, registerProduct, editProduct, getProductById } from '../services/api';

export default function CreateProduct() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [newImages, setNewImages] = useState([]); // Armazena as novas imagens para upload
  const [existingImages, setExistingImages] = useState([]); // Armazena as imagens existentes (URLs)
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchProductData = async () => {
        setLoading(true);
        try {
          const product = await getProductById(id);
          setName(product.name);
          setDescription(product.description);
          setPrice((product.priceCents / 100).toFixed(2));
          setStock(product.stock);
          
          // Armazena as URLs das imagens existentes
          setExistingImages(product.images.map(img => img.url));
        } catch (error) {
          console.error("Erro ao carregar dados do produto:", error);
          alert("Erro ao carregar dados do produto.");
          navigate('/my-products');
        } finally {
          setLoading(false);
        }
      };
      fetchProductData();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];

      // Se novas imagens foram selecionadas, faça o upload
      if (newImages.length > 0) {
        const uploadedImages = await uploadImages(newImages);
        imageUrls = uploadedImages.imageUrls;
      } else if (isEditing) {
        // Se estiver editando e nenhuma nova imagem foi selecionada, mantenha as URLs existentes
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
        await editProduct(id, productData);
        alert("Produto atualizado com sucesso!");
      } else {
        await registerProduct(productData);
        alert("Produto cadastrado com sucesso!");
      }

      navigate("/my-products");
      window.dispatchEvent(new Event("productAdded"));
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
        {/* ... (campos de input, etc.) ... */}
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
          onChange={(e) => setNewImages(Array.from(e.target.files))} // Usa setNewImages
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
