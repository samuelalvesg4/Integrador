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

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Rotas protegidas para clientes */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/create-product" element={<CreateProduct />} />
        

        {/* Rotas protegidas apenas para Vendedores */}
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
    </Router>
  );
}

export default App;