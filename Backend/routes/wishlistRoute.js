import express from 'express';
import authUser from '../middleware/auth.js';
import { addToWishlist,getUserWishlist,removeFromWishlist } from '../controllers/wishlistController.js';


const wishlistRouter = express.Router();

wishlistRouter.post('/add', authUser,addToWishlist)
wishlistRouter.get('/', authUser, getUserWishlist);
wishlistRouter.delete("/remove", authUser, removeFromWishlist)

export default wishlistRouter;