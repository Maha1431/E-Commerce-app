import express from 'express';
import { loginUser,registerUser,adminLogin,getUserOrders,getUserWishlist,addRecentlyViewed,getRecentlyViewed,forgotPassword,resetPassword,getUserInfo,updateUserInfo } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/orders', authUser, getUserOrders);
userRouter.get('/wishlist', authUser, getUserWishlist);
userRouter.post('/addrecently-viewed' , authUser, addRecentlyViewed)
userRouter.get("/recently-viewed", authUser, getRecentlyViewed)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password/:token', resetPassword);
userRouter.get("/info", authUser, getUserInfo);   // Fetch user name, email, address
userRouter.put("/info", authUser, updateUserInfo); // Update user name, email, address

export default userRouter;