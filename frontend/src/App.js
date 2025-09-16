import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Product from './pages/Product';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import SellerDashboard from './pages/SellerDashboard';
import CreateProduct from './pages/CreateProduct';
import RegisterProduct from "./pages/RegisterProduct";
import MyProducts from "./pages/MyProducts";
import Sales from "./pages/Sales";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/create-product" element={<CreateProduct />} />
          <Route path="/RegisterProduct" element={<RegisterProduct />} />
        <Route path="/MyProducts" element={<MyProducts />} />
        <Route path="/Sales" element={<Sales />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
