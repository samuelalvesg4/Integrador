import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p>Carregando...</p>;

  return (
    <>
      <Header />
      <h1>{product.name}</h1>
      <img src={product.images[0]?.url} alt={product.name} />
      <p>Preço: R${(product.priceCents/100).toFixed(2)}</p>
      <p>{product.description}</p>
      <button onClick={()=>addToCart(product)}>Adicionar ao carrinho</button>
    </>
  );
};

export default Product;
