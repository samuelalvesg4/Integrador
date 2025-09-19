import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import RegisterProduct from "./pages/RegisterProduct";
import MyProducts from "./pages/MyProducts";
import Sales from "./pages/Sales";
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Rotas protegidas para clientes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          
          {/* Rotas protegidas apenas para Vendedores */}
          <Route
            path="/create-product"
            element={
              <ProtectedRoute role="seller">
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute role="seller">
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RegisterProduct"
            element={
              <ProtectedRoute role="seller">
                <RegisterProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MyProducts"
            element={
              <ProtectedRoute role="seller">
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sales"
            element={
              <ProtectedRoute role="seller">
                <Sales />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
