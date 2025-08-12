import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
       // Get userId from auth middleware instead of request body
        const userId = req.userId;  
        const { itemId, size } = req.body;

        // Validate inputs
        if (!itemId || !size) {
            return res.status(400).json({ success: false, message: "Missing itemId or size" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure cartData object exists
        let cartData = userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
       const userId = req.userId; // from middleware
        const { itemId, size, quantity } = req.body;

        if (!itemId || !size || quantity == null) {
            return res.status(400).json({ success: false, message: "Missing itemId, size, or quantity" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure cartData exists and has correct structure
        if (!userData.cartData[itemId]) {
            userData.cartData[itemId] = {};
        }

        userData.cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData: userData.cartData });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
            const userId = req.userId; // directly from middleware

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is missing" });
        }

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
const mergeCart = async (req, res) => {
  try {
    const userId = req.body.userId; // set by auth middleware
    const guestCart = req.body.cart;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const userCart = user.cartData || {};

    // Merge logic
    for (const itemId in guestCart) {
      if (!userCart[itemId]) {
        userCart[itemId] = {};
      }

      for (const size in guestCart[itemId]) {
        if (userCart[itemId][size]) {
          userCart[itemId][size] += guestCart[itemId][size];
        } else {
          userCart[itemId][size] = guestCart[itemId][size];
        }
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData: userCart });

    res.json({ success: true, message: "Cart merged successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { addToCart, updateCart, getUserCart, mergeCart }