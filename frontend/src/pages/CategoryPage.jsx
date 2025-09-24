// frontend/src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

export default function CategoryPage() {
  const { categoryId } = useParams(); // "bebidas" ou "alimentos"
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setProducts(allProducts.filter((p) => p.category === categoryId));
    }
    fetchProducts();
  }, [categoryId]);

  const categoryColors = {
    bebidas: "bg-gradient-to-r from-blue-400 to-blue-600",
    alimentos: "bg-gradient-to-r from-blue-600 to-blue-800",
  };

  return (
    <div className={`min-h-screen p-6 text-white ${categoryColors[categoryId]}`}>
      <h1 className="text-3xl font-bold mb-6 capitalize">{categoryId}</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p>Nenhum produto encontrado nesta categoria.</p>
        )}
      </div>
    </div>
  );
}
