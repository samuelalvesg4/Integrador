// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { getProducts } from '../services/api';
import Wrapper from '../components/Wrapper';
import '../components/grid.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Define o número de células do grid para o layout 5x5
    const gridSize = 25;
    const productsToDisplay = products.slice(0, gridSize); // Pega apenas os primeiros 25 produtos
    const emptyCells = gridSize - productsToDisplay.length;

    return (
        <>
            <Header /><br/>
            <Wrapper>
                {/* Renderiza o grid container somente se não estiver carregando e houver produtos */}
                {loading ? (
                    <div className="grid-container">
                        {Array.from({ length: gridSize }, (_, index) => (
                            <div key={index} className="grid-item loading">
                                <p>Carregando...</p>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid-container">
                        {/* Mapeia e renderiza as ProductCards para cada produto */}
                        {productsToDisplay.map((product) => (
                            <div key={product.id} className="grid-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                        
                        {/* Preenche o restante do grid com células vazias se houver menos de 25 produtos */}
                        {Array.from({ length: emptyCells }, (_, index) => (
                            <div key={`empty-${index}`} className="grid-item empty"></div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Nenhum produto cadastrado ainda.</p>
                    </div>
                )}
            </Wrapper>
        </>
    );
};

export default Home;
