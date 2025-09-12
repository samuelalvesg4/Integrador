import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/seller/products') // rota backend
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <>
      <Header />
      <div style={{ padding: '2rem' }}>
        <h1>Dashboard do Vendedor</h1>
        <Link to="/seller/create-product">
          <button style={{ marginBottom: '1rem' }}>Adicionar Produto</button>
        </Link>
        {products.length === 0 ? (
          <p>Nenhum produto cadastrado ainda.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Produto</th>
                <th style={thStyle}>Preço</th>
                <th style={thStyle}>Estoque</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={tdStyle}>{product.name}</td>
                  <td style={tdStyle}>R${(product.priceCents/100).toFixed(2)}</td>
                  <td style={tdStyle}>{product.stock || 0}</td>
                  <td style={tdStyle}>
                    <button>Adicionar Estoque</button>
                    <button style={{ marginLeft: '0.5rem', backgroundColor:'#FF0000' }}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const thStyle = { borderBottom: '1px solid #ccc', padding: '0.5rem', textAlign: 'left' };
const tdStyle = { borderBottom: '1px solid #eee', padding: '0.5rem' };

export default SellerDashboard;
