import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">La tua Dashboard</h2>

      {/* Bottone per acquistare kit */}
      <button 
        className="btn btn-primary mb-3 d-block" 
        onClick={() => navigate('/products')}
      >
        Acquista Kit
      </button>

      {/* Bottone per visualizzare gli ordini */}
      <button 
        className="btn btn-primary mb-3 d-block" 
        onClick={() => navigate('/orders')}
      >
        I miei ordini
      </button>

      {/* Bottone per creare un discente */}
      <button 
        className="btn btn-primary mb-3 d-block" 
        onClick={() => navigate('/create-discente')}
      >
        Crea Discente
      </button>

      {/* Bottone per visualizzare la lista dei discenti */}
      <button 
        className="btn btn-primary mb-3 d-block" 
        onClick={() => navigate('/lista-discenti')}
      >
        Lista Discenti
      </button>
    </div>
  );
}

export default Dashboard;
