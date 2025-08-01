import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10 bg-gradient-to-r from-pink-300 to-sky-200 rounded">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the.
        </p>
      </div>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 cursor-pointer">
        {/* Rendering Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mx-3 m-6">
          {latestProducts.map((item, index) => (
            <div key={index} className="p-2">
              {" "}
              {/* Added margin/padding */}
              <ProductItem
                id={item._id}
                image={item.image[0]}
                name={item.name}
                price={item.price}
                sizes={item.sizes}
                showSizesOnHover={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestCollection;
