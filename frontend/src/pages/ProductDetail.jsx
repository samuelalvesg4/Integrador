import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext'; // Importa o hook do carrinho

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart(); // Pega a função de adicionar ao carrinho

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                // Ajuste para o preço vir em reais, não em centavos
                const productData = {
                    ...data,
                    price: data.priceCents / 100,
                };
                setProduct(productData);
            } catch (err) {
                console.error("Erro ao buscar o produto", err);
                setError("Produto não encontrado.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        alert(`${product.name} foi adicionado ao carrinho!`);
    };
    
    if (loading) {
        return (
            <div className="page-container">
                <Header />
                <main className="content-wrap"><p style={{ textAlign: 'center', padding: '2rem' }}>Carregando produto...</p></main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <Header />
                <main className="content-wrap"><p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p></main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Header />
            <main className="content-wrap">
                <div className="product-detail-container">
                    <div className="product-detail-grid">
                        {/* Coluna da Imagem */}
                        <div className="product-gallery">
                            <img 
                                src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} 
                                alt={product.name} 
                                className="main-product-image"
                            />
                        </div>

                        {/* Coluna de Informações */}
                        <div className="product-info">
                            <h1 className="product-name">{product.name}</h1>
                            <p className="product-seller">Vendido por: {product.seller?.user?.name || "Vendedor desconhecido"}</p>
                            <p className="product-price">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                            
                            <div className="product-description">
                                <h2>Descrição</h2>
                                <p>{product.description}</p>
                            </div>
                            
                            <p className="product-stock">
                                {product.stock > 0 ? `${product.stock} unidades em estoque` : "Produto esgotado"}
                            </p>

                            <div className="product-actions">
                                <button onClick={handleAddToCart} className="btn-add-to-cart" disabled={product.stock === 0}>
                                    Adicionar ao Carrinho
                                </button>
                                <button className="btn-buy-now" disabled={product.stock === 0}>
                                    Comprar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}