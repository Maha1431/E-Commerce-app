import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, size } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

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