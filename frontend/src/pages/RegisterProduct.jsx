// Exemplo de um componente de cadastro de produto (RegisterProduct.jsx)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { registerProduct, uploadImages } from '../services/api';

const RegisterProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrls = [];

            // Etapa 1: Fazer o upload das imagens
            if (selectedFiles.length > 0) {
                const uploadResponse = await uploadImages(selectedFiles);
                imageUrls = uploadResponse.imageUrls; // O backend retorna um array de URLs
            }

            // Etapa 2: Registrar o produto com os dados e as URLs
            const productData = {
                name,
                description,
                price: parseFloat(price) * 100, // Converte para centavos
                stock: parseInt(stock, 10),
                images: imageUrls, // Envia as URLs recebidas para a API
            };

            await registerProduct(productData);
            alert("Produto cadastrado com sucesso!");
            navigate('/MyProducts'); // Redireciona para a página de produtos do vendedor

        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            alert(`Erro ao cadastrar produto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="min-h-screen bg-gray-100">
      <Header />
        <form onSubmit={handleSubmit}>
            <h2>Cadastrar Novo Produto</h2>
            <input type="text" placeholder="Nome do Produto" value={name} onChange={(e) => setName(e.target.value)} required />
            <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="number" step="0.01" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <input type="number" placeholder="Estoque" value={stock} onChange={(e) => setStock(e.target.value)} required />
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
        </form>
        </div>
    );
};

export default RegisterProduct;
