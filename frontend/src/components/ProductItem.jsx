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
    <div className="bg-white shadow-md p-3 rounded hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer relativ h-[340px]">
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
        {/* Sizes - show on hover, absolutely positioned at bottom */}
       {/* Sizes - Only show on hover, below price */}
{sizes.length > 0 && showSizesOnHover && (
  <div
    className={`mt-2 flex flex-wrap gap-1 items-center text-xs transition-opacity duration-300 h-[40px] overflow-hidden ${
      isHovered ? "opacity-100" : "opacity-0"
    }`}
  >
    <span className="font-semibold text-gray-700">Size:</span>
    {sizes
      .filter((s) => s?.size)
      .map((s, i) => (
        <span
          key={i}
          className={`px-2 py-0.5 border border-gray-300 rounded-full ${
            s.quantity === 0
              ? "bg-gray-300 text-gray-500 line-through cursor-not-allowed"
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
