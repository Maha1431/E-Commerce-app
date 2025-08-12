import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL 
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
const [wishlist, setWishlist] = useState([]);

    const navigate = useNavigate();

 
    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
      
            if (response.data.success) {
              
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token]);


const fetchUserOrders = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/user/orders`, {
      headers: { token },
    });

    return res.data.success ? res.data.orders : [];
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
};

// Update addWishlist
const addWishlist = async (productId) => {
  if (!token) return;
  try {
    const res = await axios.post(
      backendUrl + '/api/user/addTowishlist',
      { productId },
      { headers: { token } }
    );
    if (res.data.success) {
      toast.success("Added to wishlist!");
      setWishlist((prev) => [...prev, res.data.item]); // push new item
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    toast.error("Failed to add to wishlist.");
  }
};

// Update fetchWishlist to also set state
const fetchWishlist = async () => {
  if (!token) return [];
  try {
    const response = await axios.get(backendUrl + '/api/user/wishlist', {
      headers: { token },
    });
    if (response.data.success) {
      setWishlist(response.data.wishlist); // set to context
      return response.data.wishlist;
    } else {
      toast.error(response.data.message || "Failed to fetch wishlist");
      return [];
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch wishlist.");
    return [];
  }
};



const fetchRecentlyViewed = async () => {
  try {
    const response = await axios.get(backendUrl + '/api/user/recently-viewed', {
      headers: { token },
    });

     if (response.data.success) {
      // Return only first 8 products
      return response.data.products.slice(0, 8);
    } else {
      toast.error(response.data.message);
      return [];
    }
}

   catch (error) {
    console.log(error);
    toast.error("Failed to fetch recently viewed products.");
    return [];
  }
};

const addRecentlyViewed = async (productId) => {
  if (!token) return; // Only logged-in users
  try {
    await axios.post(
      backendUrl + '/api/user/addrecently-viewed',
      { productId },
      { headers: { token } }
    );
  } catch (error) {
    console.error("Error adding recently viewed:", error);
  }
};
// Inside ShopContextProvider

const fetchUserInfo = async () => {
  if (!token) return null;
  try {
    const res = await axios.get(`${backendUrl}/api/user/info`, {
      headers: { token },
    });
    if (res.data.success) {
      return res.data.user; // { name, email, address }
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (err) {
    console.error("Error fetching user info:", err);
    toast.error("Failed to fetch user info.");
    return null;
  }
};

const updateUserInfo = async (updatedData) => {
  if (!token) return false;
  try {
    const res = await axios.put(
      `${backendUrl}/api/user/info`,
      updatedData, // { name, email, address }
      { headers: { token } }
    );
    if (res.data.success) {
      toast.success("Profile updated successfully!");
      return res.data.user; // updated { name, email, address }
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (err) {
    console.error("Error updating user info:", err);
    toast.error("Failed to update user info.");
    return false;
  }
};



    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems, getUserCart,
        getCartCount, updateQuantity,
        fetchRecentlyViewed, fetchUserOrders,addWishlist, fetchWishlist,addRecentlyViewed,
        getCartAmount, navigate, backendUrl,
        fetchUserInfo,updateUserInfo,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;