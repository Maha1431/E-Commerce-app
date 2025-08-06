import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductItem = ({
  id,
  image,
  name,
  price,
   oldPrice,
  discount,
  sizes = [],
  showSizesOnHover = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white shadow-md p-3 rounded hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer">
      <Link to={`/product/${id}`}>
        {/* Image Hover Area */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-52 object-cover rounded"
          />
        </div>

        {/* Product Name */}
        <h3 className="mt-2 text-sm sm:text-base font-medium truncate">
          {name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg font-bold text-red-600">${price}</p>
           {oldPrice && (
            <p className="text-sm text-gray-500 line-through">${oldPrice}</p>
          )}
            {discount && (
              <span className="ml-auto text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Sizes - Only show on hover, below price */}
         {sizes.length > 0 && showSizesOnHover && (
  <div className="mt-2 flex flex-wrap gap-1 items-center text-xs overflow-hidden">
    <span className="font-semibold text-gray-700">Size:</span>
    {sizes
     .filter((s) => s?.size) // ✅ Filter out invalid entries
    .map((s, i) => (
      <span
        key={i}
        className={`px-2 py-0.5 border border-gray-300 rounded-full transition-all duration-200 ${
          s.quantity === 0
            ? "bg-gray-300 text-gray-500 line-through cursor-not-allowed"
            : isHovered
            ? "bg-gray-200 text-black scale-105"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {s.quantity === 0 ? `${s.size} - Sold Out` : s.size}
      </span>
    ))}
  </div>
)}


        
      </Link>
    </div>
  );
};

export default ProductItem;
