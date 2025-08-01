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
    <div
      className="bg-white shadow-md p-3 rounded hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
    >
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

        {/* Sizes - Only show on hover, below price */}
        {showSizesOnHover && sizes.length > 0 && (
          <div
            className={`mt-2 flex flex-wrap gap-1 items-center text-xs transition-all duration-300 ease-in-out ${
              isHovered ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <span className="font-semibold text-gray-700">Size:</span>
            {sizes.map((size, i) => (
              <span
                key={i}
                className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-full text-gray-700"
                title={`Available in size ${size}`} // Optional tooltip
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
};

export default ProductItem;
