import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-all relative group"
            >
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 p-2 text-red-600 bg-white rounded-full hover:bg-red-100 transition"
                title="Remove from Wishlist"
              >
                <FaTrash size={14} />
              </button>

              <Link to={`/product/${item.id}`} className="block p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-md"
                />
                <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-800 truncate">
                  {item.name}
                </h3>
                <p className="text-red-600 font-semibold text-sm sm:text-base">
                  ${item.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
