import React from 'react'
import Strip from '../components/Stripe'
import {useLocation} from 'react-router-dom' 

const Checkout = () => {
  const location = useLocation()
  return (
    <div className='w-50 vh-100 mx-auto d-flex align-items-center justify-content-center'>
      <div className="">
      <Strip productId={location?.state?.productId} quantity={location?.state?.quantity} />
      </div>
    </div>
  )
}

export default Checkout
