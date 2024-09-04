import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quantities, setQuantities] = useState({});
  console.log('quantities: ', quantities['66c5a7f3034559b3ce5aae29']);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach((product) => {
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
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      [productId]: value,
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
          quantities: [quantity],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Ordine effettuato con successo!');
      setOrders([...orders, res.data]);

      setQuantities({
        ...quantities,
        [productId]: 1,
      });
    } catch (err) {
      alert("Errore durante l'effettuazione dell'ordine");
    }
  };

  return (
    <div className='container mt-4'>
      <h2 className='mb-4'>La tua Dashboard</h2>

      <h3>Prodotti</h3>
      <div className='row'>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className='col-md-4 mb-4'>
              <div className='card h-100'>
                <div className='card-body d-flex flex-column'>
                  <h5 className='card-title'>{product.title}</h5>
                  <p className='card-text'>{product.description}</p>
                  <p className='card-text'>
                    <strong>
                      €{calculatePrice(product, quantities[product._id] || 1)}
                    </strong>
                  </p>
                  <input
                    type='number'
                    min='1'
                    value={quantities[product._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        product._id,
                        parseInt(e.target.value)
                      )
                    }
                    className='form-control mb-3'
                  />
                  <button
                    // onClick={() => handlePurchase(product._id)}
                    onClick={() =>
                      navigate('/payment', {
                        state: {
                          productId: product?._id,
                          quantity: quantities[product?._id] || 1,
                          totalPrice: calculatePrice(product, quantities[product._id] || 1),
                          productName:product.title,
                        },
                      })
                    }
                    className='btn btn-primary mt-auto'
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-muted'>Nessun prodotto disponibile.</p>
        )}
      </div>

      <h3>I tuoi ordini</h3>
      <table class='table table-hover'>
        <thead>
          <tr>
            <th scope='col'>#Order Id</th>
            <th scope='col'>Product Name</th>
            <th scope='col'>Product Quantity</th>
            <th scope='col'>Order Date</th>
            <th scope='col'>Total Price</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            <>
              {orders.map((order) => (
                <tr>
                  <>
                    <th scope='row'>{order._id}</th>
                    <td>
                      {order.orderItems.map((item) => (
                        <span key={item._id} className=''>
                          {item.productId?.title}
                        </span>
                      ))}
                    </td>
                    <td>
                      {order.orderItems.map((item) => (
                        <span key={item._id} className=''>
                          {item.quantity}
                        </span>
                      ))}
                    </td>
                    <td>
                      {order?.createdAt?.split('T')[0]}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {' '}
                      <button
                        type='button'
                        class='btn btn-primary'
                        data-toggle='modal'
                        data-target='#exampleModalCenter'
                        onClick={() => handleShowModal(order)}
                      >
                        Details
                      </button>
                    </td>
                  </>
                </tr>
              ))}
            </>
          ) : (
            <p className='text-muted'>No orders found.</p>
          )}
        </tbody>
      </table>
      {showModal && selectedOrder && (
        <div
          className='modal fade show d-block'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'
        >
          <div
            className='modal-dialog modal-dialog-centered modal-lg'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between'>
                <h5 className='modal-title' id='exampleModalLongTitle'>
                  Order Details
                </h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleCloseModal}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Order Date:</strong> {selectedOrder.createdAt?.split('T')[0]}
                </p>
                {/* <p>
                  <strong>Customer Name:</strong>
                  {selectedOrder.userId?.firstName}
                  {selectedOrder.userId?.lastName}
                </p> */}
                <p>
                  <strong>Products:</strong>
                </p>
                <ul>
                  {selectedOrder.orderItems.map((item) => (
                    <>
                      <li key={item._id}>
                        Product Name : <strong>{item.productId?.title} </strong>{' '}
                        - Quantity: <strong> {item.quantity} </strong> - Price :{' '}
                        <strong> {item.price} </strong>
                        {item?.progressiveNumbers &&
                          item?.progressiveNumbers?.map((item) => (
                            <p className='py-0' style={{ padding: '0px' }}>
                              Kit Numbers : <strong>{item}</strong>
                            </p>
                          ))}
                      </li>
                    </>
                  ))}
                </ul>
                <p>
                  <strong>Total Price:</strong> {selectedOrder.totalPrice}
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
