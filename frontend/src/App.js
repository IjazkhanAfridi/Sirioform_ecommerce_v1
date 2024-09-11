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
import CreateDiscente from './pages/CreateDiscente';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import ListaDiscentiPage from './pages/ListaDiscentiPage';
import CreateCorso from './pages/CreateCorso';
import Store from './pages/Store';  // Importa la pagina Store
import StoreDetails from './pages/StoreDetails';  // Importa la pagina StoreDetails

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
        <Route path="/create-discente" element={<CreateDiscente />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/lista-discenti" element={<ListaDiscentiPage />} />
        <Route path="/create-corso" element={<CreateCorso />} />

        {/* Nuove rotte per Store e StoreDetails */}
        <Route path="/store" element={<Store />} />  {/* Aggiungi la rotta per Store */}
        <Route path="/store/:productId" element={<StoreDetails />} />  {/* Aggiungi la rotta per StoreDetails */}
      </Routes>
    </Router>
  );
}

export default App;
