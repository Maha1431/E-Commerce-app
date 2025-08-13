import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserWishlist = async (req, res) => {
  try {
     const userId = req.userId;
    const user = await userModel.findById(userId).populate("wishlist");
    res.json({ success: true, wishlist: user?.wishlist || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove productId if it exists in wishlist
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    await user.save();

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {addToWishlist,getUserWishlist,removeFromWishlist}