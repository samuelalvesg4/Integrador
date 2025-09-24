import { useState, useEffect } from "react";
import Wrapper from "../components/Wrapper";
import { useParams } from "react-router-dom";
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import Header from "../components/Header";
import './ProductDetail.css'; // Importando o novo CSS

export default function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1); // Novo estado para a quantidade
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0].url); // Define a primeira imagem como principal
                }
            } catch (err) {
                console.error("Erro ao buscar detalhes do produto", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`${quantity}x ${product.name} adicionado ao carrinho!`);
    };

    if (loading) return <Wrapper><p>Carregando produto...</p></Wrapper>;
    if (!product) return <Wrapper><p>Produto não encontrado.</p></Wrapper>;

    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.priceCents / 100);
    const isOutOfStock = product.stock <= 0;

    return (
        <div>
            <Header />
            <Wrapper>
                <div className="product-detail-container">
                    {/* Galeria de Imagens */}
                    <div className="product-gallery">
                        <img src={selectedImage || 'https://via.placeholder.com/600'} alt={product.name} className="main-image" />
                        <div className="thumbnail-images">
                            {product.images && product.images.map(image => (
                                <img 
                                    key={image.id}
                                    src={image.url} 
                                    alt="thumbnail" 
                                    className={`thumbnail ${selectedImage === image.url ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(image.url)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Detalhes do Produto */}
                    <div className="product-details">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-description">{product.description}</p>
                        <span className="product-price">{formattedPrice}</span>
                        
                        <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'available'}`}>
                            {isOutOfStock ? 'Esgotado' : `Em estoque: ${product.stock} unidades`}
                        </div>
                        
                        {!isOutOfStock && (
                            <>
                                <div className="quantity-selector">
                                    <label>Quantidade:</label>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleQuantityChange(-1)}>-</button>
                                        <input type="text" value={quantity} readOnly />
                                        <button onClick={() => handleQuantityChange(1)}>+</button>
                                    </div>
                                </div>

                                <button onClick={handleAddToCart} className="add-to-cart-btn">
                                    Adicionar ao Carrinho
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}