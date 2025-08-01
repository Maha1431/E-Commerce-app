import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    console.log("All Products:", products); // Check what products are loaded
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10  bg-gradient-to-r  from-yellow-200 to-amber-300  ">
      <div className="text-center text-3xl py-8 ">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mx-3 m-6 cursor-pointer">
        {bestSeller.map((item, index) => (
          <div key={index} className="p-2">
            {" "}
            {/* Add padding/margin here */}
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              sizes={item.sizes}
              showSizesOnHover={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
