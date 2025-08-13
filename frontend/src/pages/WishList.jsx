import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const WishList = () => {
  const { wishlist = [], removeWishlist, products = [], token, fetchWishlist } =
    useContext(ShopContext);

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token]);

  // DEBUG: inspect shapes & timing
  console.log("WishList debug: token", token);
  console.log("WishList debug: products.length", products.length, products.slice(0,2));
  console.log("WishList debug: wishlist", wishlist.slice ? wishlist.slice(0,10) : wishlist);

  // Normalize wishlist to an ID set (works if wishlist is array of IDs or array of objects)
  const wishlistIdSet = useMemo(() => {
    if (!Array.isArray(wishlist)) return new Set();
    return new Set(
      wishlist.map((w) => {
        if (typeof w === "string") return String(w);
        if (w && (w._id || w.id)) return String(w._id ?? w.id);
        return null;
      }).filter(Boolean)
    );
  }, [wishlist]);

  // Map IDs -> product objects from products catalog
  const wishlistProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    return products.filter((p) => wishlistIdSet.has(String(p._id)));
  }, [products, wishlistIdSet]);

  // If server returned populated product objects directly, use them:
  const serverPopulated =
    Array.isArray(wishlist) && wishlist.length > 0 && typeof wishlist[0] === "object" && wishlist[0]._id;

  const finalList = serverPopulated ? wishlist : wishlistProducts;

  // DEBUG: show what we'll render
  console.log("WishList debug: wishlistProducts", wishlistProducts);
  console.log("WishList debug: finalList (rendering)", finalList);

  if (!Array.isArray(wishlist)) return <p>Error loading wishlist.</p>;
  if ((Array.isArray(wishlist) && wishlist.length === 0) || finalList.length === 0) {
    return <p className="text-center">No items in wishlist.</p>;
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Wishlist</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {finalList.map((item) => (
          <div key={item._id ?? item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-all relative group">
            <button
              onClick={() => removeWishlist(item._id ?? item.id)}
              className="absolute top-2 right-2 p-2 text-red-600 bg-white rounded-full hover:bg-red-100 transition"
              title="Remove from Wishlist"
            >
              <FaTrash size={14} />
            </button>

            <Link to={`/product/${item._id ?? item.id}`} className="block p-3">
              {Array.isArray(item.image) && item.image.length > 0 && (
                <img src={item.image[0]} alt={item.name} className="w-full h-40 sm:h-48 object-cover rounded-md" />
              )}
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-800 truncate">{item.name}</h3>
              {item.price != null && <p className="text-red-600 font-semibold text-sm sm:text-base">${item.price}</p>}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;
