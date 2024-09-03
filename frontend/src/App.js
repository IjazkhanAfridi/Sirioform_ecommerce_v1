import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import CreateProduct from './pages/CreateProduct';
import AdminOrders from './pages/AdminOrders'; 
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Checkout />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/admin/all-orders" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
