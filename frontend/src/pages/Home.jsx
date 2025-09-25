// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { getProducts } from '../services/api';
import Wrapper from '../components/Wrapper';
import '../components/grid.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error("Erro ao buscar todos os produtos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();

        const handler = () => fetchAllProducts();
        window.addEventListener("productAdded", handler);
        return () => window.removeEventListener("productAdded", handler);
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <Header />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SearchBar query={query} setQuery={setQuery} />
            </div>
            <Wrapper>
                {loading ? (
                    <div className="grid-container">
                        {/* Renderiza um esqueleto de carregamento */}
                        {Array.from({ length: 5 }, (_, index) => (
                            <div key={index} className="grid-item loading">
                                <p>Carregando...</p>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid-container">
                        {/* CORRIGIDO: Mapeia apenas sobre os produtos que existem */}
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="grid-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Nenhum produto encontrado.</p>
                    </div>
                )}
            </Wrapper>
        </>
    );
};

export default Home;