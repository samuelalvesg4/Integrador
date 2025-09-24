import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import { getAllProducts } from '../services/api'; // Sua função de API real

export default function Section() {
  const { id } = useParams(); // 'id' será "bebidas" ou "alimentos"
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // const data = await getAllProducts(); // Use sua chamada de API real aqui
        // setAllProducts(data);
        
        // --- DADOS DE EXEMPLO (remova quando a API estiver conectada) ---
        const exampleData = [
            { id: 1, name: "Coca Cola 2L", price: 9.50, category: 'bebidas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2-2e55a2xqt23p82LVV2zDWz-a-1h35uBwQ&s' },
            { id: 2, name: "Pepsi 1L", price: 6.00, category: 'bebidas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6s23jcsd2D-bc29S-2G_Ka-30CfHqLgmEzA&s' },
            { id: 3, name: "Guaraná Antarctica 2L", price: 8.00, category: 'bebidas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7g_gPcsf4L_2A8A2gTNcYj2jWk5p4W_y-Yw&s' },
            { id: 4, name: "Arroz 5kg", price: 25.00, category: 'alimentos', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjF5g-u-m4X_mP8Zz_X6o_y_X3q_X_X3q_Xw&s' },
            { id: 6, name: "Feijão 1kg", price: 8.00, category: 'alimentos', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj7g_gPcsf4L_2A8A2gTNcYj2jWk5p4W_y-Yw&s' },
        ];
        setAllProducts(exampleData);
        // --- FIM DOS DADOS DE EXEMPLO ---

      } catch (err) {
        setError("Não foi possível carregar os produtos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = allProducts
    .filter(p => p.category === id)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const sectionTitle = id === 'bebidas' ? 'Seção de Bebidas' : 'Seção de Alimentos';

  return (
    <div className="page-container">
      <Header />
      <main className="content-wrap">
        <div className="section-container">
          <h1 className="section-title">{sectionTitle}</h1>

          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Pesquisar produto..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>🔍</button>
          </div>

          {loading && <p style={{ textAlign: 'center' }}>Carregando produtos...</p>}
          {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
          
          {!loading && !error && (
            filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                    <div className="product-card">
                      <img src={product.imageUrl} alt={product.name} />
                      <h3>{product.name}</h3>
                      <p>R$ {product.price.toFixed(2).replace('.', ',')}</p>
                      <button>Ver Detalhes</button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', marginTop: '2rem' }}>Nenhum produto encontrado nesta seção.</p>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}