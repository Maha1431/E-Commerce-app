import React, { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { ShopContext } from "../context/ShopContext";
import Title from '../components/Title';

const SpecialOffers = () => {
  const { products } = useContext(ShopContext);
  const [offerProducts, setOfferProducts] = useState([]);

 useEffect(() => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5); // Pick any 5 products

  const updatedProducts = selected.map((item) => {
    const oldPrice = item.price + 50;
    const discount = Math.round(((oldPrice - item.price) / oldPrice) * 100);

    return {
      ...item,
      oldPrice,
      discount,
    };
  });

  setOfferProducts(updatedProducts);
}, [products]);


  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 bg-gradient-to-r from-purple-500 to-red-500 mb-5">
      <div className='text-center text-3xl py-8 '>
        <Title text1={'SPECIAL OFFERS'} text2={'FOR YOU'}/>
        </div>

      {offerProducts.length === 0 ? (
        <p className="text-center text-white">No special offers available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {offerProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              oldPrice={item.oldPrice}
              discount={item.discount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
