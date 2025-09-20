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

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Você precisa estar logado para cadastrar um produto.");
            navigate('/login');
            setLoading(false);
            return;
        }

        try {
            // Passo 1: Registra o produto no banco de dados
            const productData = {
                name,
                description,
                price: parseFloat(price) * 100,
                stock: parseInt(stock, 10),
            };

            // Certifique-se de que a função registerProduct retorna o produto completo
            const newProduct = await registerProduct(productData);

            // Passo 2: Faz o upload das imagens, se houver, usando o ID do novo produto
            if (selectedFiles.length > 0) {
                // Passa os arquivos e o ID do novo produto
                await uploadImages(selectedFiles, newProduct.id); 
            }

            alert("Produto cadastrado com sucesso!");
            navigate('/MyProducts');

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
