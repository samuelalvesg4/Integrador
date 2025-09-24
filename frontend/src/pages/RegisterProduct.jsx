import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { registerProduct, uploadImages } from '../services/api';
import useAuth from '../hooks/useAuth';
import imageCompression from 'browser-image-compression';

const RegisterProduct = () => {
  useAuth({ role: 'seller' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Atualiza inputs de texto
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload e compressão das imagens
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (files.length + selectedFiles.length > 6) {
      setError('Você pode enviar no máximo 6 imagens.');
      return;
    }

    setError('');
    const compressedFiles = [];
    const previews = [];

    for (const file of files) {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      try {
        const compressedFile = await imageCompression(file, options);
        compressedFiles.push(compressedFile);
        previews.push(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Erro ao comprimir imagem:", error);
        setError('Erro ao processar uma imagem.');
      }
    }

    setSelectedFiles((prev) => [...prev, ...compressedFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Por favor, adicione pelo menos uma imagem.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) * 100, // preço em centavos
        stock: parseInt(formData.stock, 10),
      };

      const newProduct = await registerProduct(productData);

      if (newProduct && newProduct.id) {
        await uploadImages(newProduct.id, selectedFiles);
      }

      alert("Produto cadastrado com sucesso!");
      navigate('/my-products');
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setError(error.body?.error || error.message || 'Erro ao cadastrar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content-wrap">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Cadastrar Novo Produto</h1>
            <p className="form-subtitle">Preencha os detalhes abaixo para adicionar um item à sua loja.</p>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            {error && <p className="error-message">{error}</p>}
            <div className="form-grid">
              <div className="form-group span-2">
                <label htmlFor="name" className="form-label">Nome do Produto</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
              </div>

              <div className="form-group span-2">
                <label htmlFor="description" className="form-label">Descrição</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-textarea" rows="4" required></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="price" className="form-label">Preço (R$)</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="form-input" placeholder="Ex: 25.99" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="stock" className="form-label">Estoque</label>
                <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="form-input" placeholder="Ex: 100" required />
              </div>

              <div className="form-group span-2">
                <label htmlFor="category" className="form-label">Categoria</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                  <option value="">Selecione uma categoria</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="alimentos">Alimentos</option>
                </select>
              </div>

              <div className="form-group span-2">
                <label className="form-label">Imagens (até 6)</label>
                <div className="file-input-container">
                  <label htmlFor="images" className="file-input-label">Escolher Arquivos</label>
                  <input
                    type="file"
                    id="images"
                    onChange={handleFileChange}
                    className="file-input"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                  />
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="image-preview-container span-2">
                  {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Pré-visualização ${index + 1}`} className="image-preview" />
                  ))}
                </div>
              )}
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterProduct;
