import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from './context/CartContext';

// 1. Importações adicionadas
import useUser from "./hooks/useUser"; // O hook que criamos
import SellerDashboard from "./pages/SellerDashboard"; // O novo dashboard do vendedor

// Suas importações existentes
import Login from "./pages/Login";
import Register from "./pages/Register"
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import RegisterProduct from "./pages/RegisterProduct";
import MyProducts from "./pages/MyProducts";
import Sales from "./pages/Sales";

// 2. Componente "inteligente" que decide qual página inicial mostrar
function MainPage() {
    const user = useUser();
    
    // Se o usuário existir e for um vendedor, mostra o Dashboard.
    if (user && user.role === 'seller') {
        return <SellerDashboard />;
    }
    
    // Para todos os outros casos (cliente ou visitante), mostra a Home padrão.
    return <Home />;
}


function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* 3. Rota principal atualizada para usar o MainPage, que decide o que mostrar */}
          <Route path="/" element={<MainPage />} />

          {/* --- Rotas Protegidas para Clientes --- */}
          {/* 4. Rotas de cliente agora são protegidas para o papel 'customer' (ou 'client') */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="customer">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* --- Rotas Protegidas para Vendedores --- */}
          <Route path="/create-product" element={<ProtectedRoute role="seller"><CreateProduct /></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute role="seller"><CreateProduct /></ProtectedRoute>} />
          <Route path="/register-product" element={<ProtectedRoute role="seller"><RegisterProduct /></ProtectedRoute>} />
          <Route path="/my-products" element={<ProtectedRoute role="seller"><MyProducts /></ProtectedRoute>} />
          <Route path="/Sales" element={<ProtectedRoute role="seller"><Sales /></ProtectedRoute>} />
          
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;