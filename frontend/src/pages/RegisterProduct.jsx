import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { registerProduct, uploadImages } from '../services/api';
import useAuth from '../hooks/useAuth';
import imageCompression from 'browser-image-compression';

const RegisterProduct = () => {
    // Garante que o usuário logado é um vendedor
    useAuth({ role: 'seller' });

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const compressedFiles = [];

        for (const file of files) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                compressedFiles.push(compressedFile);
            } catch (error) {
                console.error(error);
            }
        }
        setSelectedFiles(compressedFiles);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Sessão expirada. Por favor, faça login novamente.');
            navigate('/login');
            setLoading(false);
            return;
        }

        // 1. Cadastrar o produto primeiro para obter o ID
        const productData = {
            name,
            description,
            price: parseFloat(price) * 100,
            stock: parseInt(stock, 10),
            images: [], // Começa com um array vazio de imagens
        };

        const newProduct = await registerProduct(productData);
        const productId = newProduct.id; // Assume que o backend retorna o ID do novo produto

        let imageUrls = [];

        // 2. Fazer o upload das imagens usando o ID do produto recém-criado
        if (selectedFiles.length > 0) {
            const uploadResponse = await uploadImages(selectedFiles, productId);
            imageUrls = uploadResponse.imageUrls; // Armazena as URLs retornadas
        }

        alert("Produto cadastrado e imagens enviadas com sucesso!");
        navigate('/MyProducts');

    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        alert(`Erro ao cadastrar produto: ${error.body?.error || error.message}`);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastrar Produto</h2>
                        <input
                            type="text"
                            placeholder="Nome do Produto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border p-2 rounded w-full"
                        />
                        <textarea
                            placeholder="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Preço (R$)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Estoque"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="border p-2 rounded w-full"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full w-full hover:bg-blue-700 transition duration-300"
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterProduct;
