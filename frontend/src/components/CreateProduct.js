import React, { useState } from 'react';
import axios from 'axios';

function CreateProduct() {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price1, setPrice1] = useState('');
  const [price2, setPrice2] = useState('');
  const [price3, setPrice3] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/products', {
        code,
        title,
        description,
        price1,
        price2,
        price3
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Product created successfully!');
      // Reset the form
      setCode('');
      setTitle('');
      setDescription('');
      setPrice1('');
      setPrice2('');
      setPrice3('');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Code:</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Price 1:</label>
          <input type="number" value={price1} onChange={(e) => setPrice1(e.target.value)} required />
        </div>
        <div>
          <label>Price 2:</label>
          <input type="number" value={price2} onChange={(e) => setPrice2(e.target.value)} required />
        </div>
        <div>
          <label>Price 3:</label>
          <input type="number" value={price3} onChange={(e) => setPrice3(e.target.value)} required />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;
