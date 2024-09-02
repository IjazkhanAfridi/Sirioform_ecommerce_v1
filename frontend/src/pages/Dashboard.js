import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setProducts([]);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value
    });
  };

  const calculatePrice = (product, quantity) => {
    if (quantity <= 10) {
      return product.price1;
    } else if (quantity <= 20) {
      return product.price2;
    } else {
      return product.price3;
    }
  };

  const handlePurchase = async (productId) => {
    const quantity = quantities[productId] || 1;

    if (quantity < 1) {
      alert('Per favore, inserisci una quantità valida.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders',
        { 
          productIds: [productId], 
          quantities: [quantity] 
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Ordine effettuato con successo!');
      setOrders([...orders, res.data]);

      setQuantities({
        ...quantities,
        [productId]: 1
      });
    } catch (err) {
      alert('Errore durante l\'effettuazione dell\'ordine');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">La tua Dashboard</h2>
      
      <h3>Prodotti</h3>
      <div className="row">
        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>€{calculatePrice(product, quantities[product._id] || 1)}</strong></p>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                    className="form-control mb-3"
                  />
                  <button 
                    onClick={() => handlePurchase(product._id)} 
                    className="btn btn-primary mt-auto"
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Nessun prodotto disponibile.</p>
        )}
      </div>
      
      <h3>I tuoi ordini</h3>
      <ul className="list-group">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map(order => (
            <li key={order._id} className="list-group-item">
              <strong>Ordine #{order._id}</strong>
              <ul className="list-group list-group-flush">
                {order.orderItems.map(item => (
                  <li key={item.productId} className="list-group-item">
                    ID Prodotto: {item.productId} - Quantità: {item.quantity} - Prezzo: €{item.price}
                    <ul className="list-group list-group-flush">
                      {item.progressiveNumbers.map((num, index) => (
                        <li key={index} className="list-group-item">Numero Kit: {num}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <p className="mt-2">Prezzo Totale: €{order.totalPrice}</p>
            </li>
          ))
        ) : (
          <p className="text-muted">Nessun ordine trovato.</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
