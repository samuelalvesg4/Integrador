// frontend/src/pages/Product.jsx

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import { useParams } from "react-router-dom";
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use o hook para acessar a função de adicionar ao carrinho
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do produto", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Wrapper>
        <p>Carregando produto...</p>
      </Wrapper>
    );
  }

  if (!product) {
    return (
      <Wrapper>
        <p>Produto não encontrado.</p>
      </Wrapper>
    );
  }
  
  const getTransformedUrl = (url) => {
    if (!url) return null;
    const transformation = 'w_800,h_800,c_fill';
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  };

  const imageUrl = (product.images && product.images.length > 0)
    ? getTransformedUrl(product.images[0].url)
    : null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div>
      <Header />
      <Wrapper>
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg shadow-md">
          {/* Imagem do Produto */}
          <div className="md:w-1/2 flex justify-center items-center">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="max-w-full h-auto rounded-lg" />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                <span className="text-sm">Sem Imagem</span>
              </div>
            )}
          </div>
          {/* Detalhes do Produto */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <span className="text-2xl font-bold text-gray-900 mb-4">{formattedPrice}</span>
            <span className="text-lg text-gray-500">Em estoque: {product.stock}</span>
            <button
              onClick={() => addToCart(product)}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
