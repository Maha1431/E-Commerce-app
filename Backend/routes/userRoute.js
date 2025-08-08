import express from 'express';
import { loginUser,registerUser,adminLogin,getUserOrders,getUserWishlist,addRecentlyViewed,getRecentlyViewed,forgotPassword,resetPassword } from '../controllers/userController.js';
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

export default userRouter;