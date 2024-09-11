import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function StoreDetails() {
  const { productId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera i dettagli degli ordini per il prodotto selezionato
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/acquistati', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Trova il prodotto con l'ID selezionato
        const prodottoDettagli = res.data.find(prod => prod._id === productId);
        if (prodottoDettagli && prodottoDettagli.orderItems) {
          setOrderItems(prodottoDettagli.orderItems);  // Imposta gli orderItems solo se esistono
        } else {
          setOrderItems([]);  // Inizializza come array vuoto in caso non ci siano orderItems
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [productId]);

  return (
    <div className="container mt-4">
      <h2>Dettagli Prodotto</h2>
      {orderItems && orderItems.length === 0 ? (
        <p>Nessun dettaglio disponibile per questo prodotto.</p>
      ) : (
        <ul className="list-group">
          {orderItems.map((item, index) => (
            <li key={index} className="list-group-item">
              Codici: {item.progressiveNumbers ? item.progressiveNumbers.join(', ') : 'Nessun codice disponibile'}
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/store')}>
        Torna allo Store
      </button>
    </div>
  );
}

export default StoreDetails;
