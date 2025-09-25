// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Header from '../components/Header';
// import { getProductById } from '../services/api';

// export default function ProductDetail() {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const data = await getProductById(id);
//                 setProduct(data);
//             } catch (err) {
//                 console.error("Erro ao buscar o produto", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProduct();
//     }, [id]);

//     if (loading) {
//         return <p>Carregando detalhes do produto...</p>;
//     }

//     if (!product) {
//         return <p>Produto não encontrado.</p>;
//     }

//     const handleAddToCart = () => {
//         alert("Adicionar ao carrinho!");
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <Header />
//             <div className="p-6">
//                 <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
//                     {product.images && product.images.length > 0 && (
//                         <img src={`http://localhost:4000${product.images[0].url}`} alt={product.name} className="w-full h-80 object-cover rounded-md mb-4" />
//                     )}
//                     <h2 className="text-3xl font-bold">{product.name}</h2>
//                     <p className="text-gray-600 mt-2">Por: {product.seller?.user?.name || "Vendedor desconhecido"}</p>
//                     <p className="text-2xl font-bold text-blue-600 mt-4">R$ {product.price.toFixed(2)}</p>
//                     <p className="mt-4">{product.description}</p>
//                     <p className="text-gray-500 mt-2">Em estoque: {product.stock}</p>

//                     <div className="mt-6 flex space-x-4">
//                         <button
//                             onClick={handleAddToCart}
//                             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//                         >
//                             Adicionar ao Carrinho
//                         </button>
//                         <button
//                             className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
//                         >
//                             Comprar Agora
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }