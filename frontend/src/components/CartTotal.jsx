import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();

  // Shipping is free if subtotal > 500
  const shippingFee = subtotal > 500 ? 0 : delivery_fee;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency} {subtotal}.00</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>
            {shippingFee === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `${currency} ${shippingFee}.00`
            )}
          </p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <b>Total</b>
          <b>{currency} {subtotal === 0 ? 0 : subtotal + shippingFee}.00</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal;
