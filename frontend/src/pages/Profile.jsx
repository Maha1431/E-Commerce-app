import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import RateProduct from "../components/RateProduct";

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [visibleRatingId, setVisibleRatingId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: { street: "", city: "", zip: "" },
  });

  const {
    token,
    fetchUserOrders,
    fetchRecentlyViewed,
    fetchUserInfo,
    fetchWishlist,
    updateUserInfo,
  } = useContext(ShopContext);

  useEffect(() => {
    const loadUserAndOrders = async () => {
      try {
        const [userData, ordersData] = await Promise.all([
          fetchUserInfo(),
          fetchUserOrders(),
        ]);

        let finalAddress = { ...userData?.address };

        if (ordersData?.length > 0) {
          const sortedOrders = [...ordersData].sort(
            (a, b) => new Date(b.date) - new Date(a.date) // latest first
          );
          const latestOrder = sortedOrders[0];

          if (latestOrder?.address) {
            finalAddress = {
              street: latestOrder.address.street || finalAddress.street || "",
              city: latestOrder.address.city || finalAddress.city || "",
              zip: latestOrder.address.zipcode || finalAddress.zipcode || "",
            };
          }
        }

        setUserInfo({
          ...userData,
          address: finalAddress,
        });

        // make sure edit form has same data
        setFormData({
          name: userData?.name || "",
          email: userData?.email || "",
          address: finalAddress,
        });
      } catch (err) {
        console.error("Error loading user/profile data:", err);
      }
    };

    if (token) {
      loadUserAndOrders();
    }
  }, [token]);

  const handleSave = async () => {
    try {
      await updateUserInfo(formData);
      setUserInfo(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user info", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, recentlyViewedData,wishlist] = await Promise.all([
          fetchUserOrders(),
          fetchRecentlyViewed(),
          
        ]);
       const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored || []);
        
        setOrders(ordersData || []);
        setRecentlyViewed(recentlyViewedData || []);
       
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    if (token) fetchData();
  }, [token, fetchUserOrders, fetchRecentlyViewed]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* USER INFO */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-6 w-full">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            userInfo?.name || "User"
          )}&background=random`}
          alt="Profile"
          className="w-20 h-20 rounded-full border mx-auto sm:mx-0"
        />

        <div className="flex-1 w-full">
          {isEditing ? (
            <div className="space-y-3 w-full">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded p-2"
                placeholder="Name"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded p-2"
                placeholder="Email"
              />
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                className="w-full border rounded p-2"
                placeholder="Street"
              />
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                className="w-full border rounded p-2"
                placeholder="City"
              />
              <input
                type="text"
                value={formData.address.zip}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zip: e.target.value },
                  })
                }
                className="w-full border rounded p-2"
                placeholder="ZIP Code"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">
                {userInfo?.name || "User"}
              </h2>
              <p className="text-gray-600 break-words">{userInfo?.email}</p>
              {userInfo?.address && (
                <p className="text-gray-500 text-sm break-words">
                  {userInfo.address.street}, {userInfo.address.city},{" "}
                  {userInfo.address.zip}
                </p>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ORDERS */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        {orders
          .filter((order) => order.status === "Delivered")
          .map((order, idx) => (
            <div key={idx} className="border p-4 mb-6 rounded">
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>

              {order.items?.map((item,index) => {
                 const uniqueKey = `${order._id}-${item.productId?._id || item.productId || index}`;
                return (
                  <div key={uniqueKey} className="mt-3 border-t pt-3">
                    <p>
                      <strong>Product:</strong> {item.name}
                    </p>

                    {visibleRatingId === uniqueKey ? (
                      <RateProduct
                        productId={uniqueKey}
                        onClose={() => setVisibleRatingId(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setVisibleRatingId(uniqueKey)}
                        className="text-blue-600 underline text-sm mt-1"
                      >
                        Rate this product
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      {/* WISHLIST */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((item) => (
              <div key={item.id} className="flex justify-center">
                <div className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1 max-w-[180px] w-full">
                  <Link to={`/product/${item.id}`} className="block">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-auto h-40 mx-auto object-contain rounded-t-lg"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECENTLY VIEWED */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
        {recentlyViewed.length === 0 ? (
          <p className="text-gray-600">No recently viewed products.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentlyViewed.map((product) => (
              <div key={product._id} className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={product.image[0]} alt="" />
                <div>
                  <p className="sm:text-base font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
