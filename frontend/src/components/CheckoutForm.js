import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = ({ productId, quantity, onOrderSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      setMessage(result.error.message);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
      handlePurchase(productId, quantity);
    } else {
      setMessage(`Payment status: ${result.paymentIntent.status}`);
    }

    setIsProcessing(false);
  };

  const handlePurchase = async (productId, quantity) => {
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
      alert('Order placed successfully!');
      onOrderSuccess(res.data);
    } catch (err) {
      alert("Error placing the order");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || isProcessing} className='btn btn-primary w-100 my-2'>
        {isProcessing ? "Processing..." : "Submit Payment"}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default CheckoutForm;
