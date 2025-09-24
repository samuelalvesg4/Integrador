import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from './context/CartContext';
import useUser from "./hooks/useUser";
import SellerDashboard from "./pages/SellerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

// Importações dos componentes de página
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import MyProducts from "./pages/MyProducts";
import RegisterProduct from "./pages/RegisterProduct";
import Sales from "./pages/Sales";
import Footer from "./components/Footer";
import Sections from "./pages/Sections";   
import Section from "./pages/Section";   

// Componente "inteligente" que decide qual página inicial mostrar
function MainPage() {
  const user = useUser();
  
  if (user && user.role === 'seller') {
    return <SellerDashboard />;
  }
  
  return <Home />;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              {/* --- Rotas Públicas --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Rota principal que decide o que mostrar */}
              <Route path="/" element={<MainPage />} />

              {/* 🔹 Novas rotas de seções */}
              <Route path="/sections" element={<Sections />} />
              <Route path="/section/:id" element={<Section />} />

              {/* --- Rotas Protegidas para Clientes --- */}
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
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute role="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* --- Rotas Protegidas para Vendedores --- */}
              <Route path="/create-product" element={<ProtectedRoute role="seller"><CreateProduct /></ProtectedRoute>} />
              <Route path="/edit-product/:id" element={<ProtectedRoute role="seller"><CreateProduct /></ProtectedRoute>} />
              <Route path="/register-product" element={<ProtectedRoute role="seller"><RegisterProduct /></ProtectedRoute>} />
              <Route path="/my-products" element={<ProtectedRoute role="seller"><MyProducts /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute role="seller"><Sales /></ProtectedRoute>} />
              <Route
                path="/seller-dashboard"
                element={
                  <ProtectedRoute role="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
