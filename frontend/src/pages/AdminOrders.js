import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Orders</h2>
      <div className="mb-4">
        <Link to="/admin/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="list-group">
          {orders.map(order => (
            <div key={order._id} className="list-group-item mb-3">
              <h5>Order #{order._id}</h5>
              <p>Customer: {order.user?.firstName || 'Unknown'} {order.user?.lastName || 'Unknown'}</p>
              <ul className="list-group">
                {order.orderItems.map(item => (
                  <li key={item._id} className="list-group-item">
                    Product ID: {item.productId} - Quantity: {item.quantity} - 
                    Code: {item.code || 'N/A'} - Price: €{item.price}
                  </li>
                ))}
              </ul>
              <p className="mt-2"><strong>Total Price:</strong> €{order.totalPrice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No orders found.</p>
      )}
    </div>
  );
}

export default AdminOrders;
