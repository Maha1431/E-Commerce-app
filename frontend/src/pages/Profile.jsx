import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import RateProduct from "../components/RateProduct";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const[wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [visibleRatingId, setVisibleRatingId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

 const { token, fetchUserOrders, fetchRecentlyViewed } = useContext(ShopContext);

  // Decode token and extract user info
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserInfo(payload);
        console.log("Decoded token payload:", payload);
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, [token]);

 
// UPDATE fetchData to use localStorage for wishlist:
useEffect(() => {
  const fetchData = async () => {
    try {
      const [ordersData, recentlyViewedData] = await Promise.all([
        fetchUserOrders(),
        fetchRecentlyViewed(),
      ]);

      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      setOrders(ordersData || []);
      setRecentlyViewed(recentlyViewedData || []);
      setWishlist(storedWishlist); // <- from localStorage
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  if (token) fetchData();
}, [token]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      

    {/* Orders */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        {orders.filter(order => order.status === "Delivered").length === 0 ? (
          <p className="text-gray-600">No delivered orders yet.</p>
        ) : (
          orders
            .filter(order => order.status === "Delivered")
            .map((order, idx) => (
              <div key={idx} className="border p-4 mb-6 rounded">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total:</strong> ₹{order.amount}</p>
                <p><strong>Status:</strong> {order.status}</p>

                {Array.isArray(order.items) &&
                  order.items.map((item, i) => {
                    if (!item?.productId || !userInfo?._id) return null;
                    const uniqueKey = item.productId?.toString();

;

                    return (
                      <div key={uniqueKey} className="mt-3 border-t pt-3">
                        <p><strong>Product:</strong> {item.name}</p>
                        <button
                          onClick={() =>  {console.log("Clicked to rate:", uniqueKey)
                             setVisibleRatingId(uniqueKey)}}
                          className="text-blue-600 underline text-sm mt-1"
                        >
                          Rate this product
                        </button>
                        {visibleRatingId === uniqueKey && (
                             <>
                             {console.log("Rendering RateProduct for", uniqueKey)}
                          <RateProduct
                            productId={item.productId?.toString()}
                            userId={userInfo._id}
                            onClose={() => setVisibleRatingId(null)}
                          />
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))
        )}
      </div>


      {/* Wishlist */}
<div className="mb-8">
  <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
  {wishlist.length === 0 ? (
    <p className="text-gray-600">Your wishlist is empty.</p>
  ) : (
    <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1"
        >
          <Link to={`/product/${item.id}`} className="block">
            <img
              src={item.image}
              alt={item.name}
              className="w-auto h-40 sm:h-48 object-cover rounded-t-lg"
            />
            <div className="p-3">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-red-600 font-semibold text-sm sm:text-base mt-1">
                ₹{item.price}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Recently Viewed */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
        {recentlyViewed.length === 0 ? (
          <p className="text-gray-600">No recently viewed products.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentlyViewed.map((product) => (
              <div  key={product._id} className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={product.image[0]} alt="" />
                        
                <p className='sm:text-base font-medium'>{product.name}</p>
                <p className="text-sm text-gray-600">₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
