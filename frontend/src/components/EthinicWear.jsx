import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";

const EthnicWear = () => {
  const { products } = useContext(ShopContext);
  const [ethnicwearProducts, setEthnicwearProducts] = useState([]);

  useEffect(() => {
    const filtered = products
      .filter((item) => item.subCategory.toLowerCase() === "ethnicwear")
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 5); // Pick any 5

    setEthnicwearProducts(filtered);
  }, [products]);

  return (
    <div className="pt-5 px-4 mb-6 border-t bg-orange-400">
      <div className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        <Title text1="ETHNIC" text2="WEARS" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {ethnicwearProducts.map((item, index) => (
          <div key={index} className="w-full aspect-[3/4]">
            {" "}
            {/* Adjust aspect ratio */}
            <ProductItem
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image[0]}
              sizes={item.sizes}
              showSizesOnHover={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthnicWear;
