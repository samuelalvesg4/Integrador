import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSellerProducts, deleteProduct } from '../services/api';
import useAuth from '../hooks/useAuth';
import { Edit, Trash2, PlusSquare } from 'lucide-react';

export default function MyProducts() {
    useAuth({ role: 'seller' });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const data = await getSellerProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar produtos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;
        try {
            await deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
            alert("Produto deletado com sucesso!");
        } catch (err) {
            console.error("Erro ao deletar o produto:", err);
            alert(err?.body?.error || "Ocorreu um erro ao deletar.");
        }
    };

    return (
        <div className="page-container">
            <Header />
            <main className="content-wrap">
                <div className="my-products-container">
                    <div className="page-header">
                        <h1>Meus Produtos</h1>
                        <Link to="/register-product" className="btn-add-new">
                            <PlusSquare size={20} />
                            Adicionar Novo Produto
                        </Link>
                    </div>

                    {loading && <p>Carregando produtos...</p>}
                    {error && <p className="error-message">{error}</p>}

                    {!loading && !error && (
                        <div className="table-wrapper">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Imagem</th>
                                        <th>Nome</th>
                                        <th>Preço</th>
                                        <th>Estoque</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map(product => (
                                            <tr key={product.id}>
                                                <td>
                                                    <img 
                                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                                                        alt={product.name} 
                                                        className="product-thumbnail" 
                                                    />
                                                </td>
                                                <td data-label="Nome">{product.name}</td>
                                                <td data-label="Preço">R$ {(product.priceCents / 100).toFixed(2).replace('.', ',')}</td>
                                                <td data-label="Estoque">{product.stock}</td>
                                                <td data-label="Ações" className="actions-cell">
                                                    <Link to={`/edit-product/${product.id}`} className="btn-action btn-edit">
                                                        <Edit size={16} /> Editar
                                                    </Link>
                                                    <button onClick={() => handleDelete(product.id)} className="btn-action btn-delete">
                                                        <Trash2 size={16} /> Deletar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="no-products-message">Você ainda não cadastrou nenhum produto.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};