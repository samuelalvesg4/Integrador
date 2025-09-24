import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
// ... (outros imports) ...
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
          {/* ... (outras rotas públicas) ... */}

          {/* Rotas protegidas para Vendedores */}
          <Route
            path="/register-product" // <-- minúscula
            element={
              <ProtectedRoute role="seller">
                <RegisterProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-products" // <-- minúscula
            element={
              <ProtectedRoute role="seller">
                <MyProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales" // <-- minúscula
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