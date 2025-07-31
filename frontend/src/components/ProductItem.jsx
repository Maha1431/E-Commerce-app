// ProductItem.jsx
import React from "react";
import { Link } from "react-router-dom";


const ProductItem = ({ id, image, name, price, oldPrice, discount }) => {
  return (
    <div className="bg-white shadow-md p-3 rounded hover:scale-105 transition cursor-pointer">
       <Link to={`/product/${id}`}>
      <img src={image} alt={name} className="w-full h-2/3 object-cover rounded" />
      <h3 className="mt-2 text-sm sm:text-base font-medium truncate whitespace-nowrap overflow-hidden">{name}</h3>

      <div className="flex items-center gap-2 mt-1">
        <p className="text-lg font-bold text-red-600">${price}</p>

        {oldPrice && (
          <p className="text-sm line-through text-gray-500">${oldPrice}</p>
        )}

        {discount && (
          <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>
      </Link>
    </div>
  );
};

export default ProductItem;
