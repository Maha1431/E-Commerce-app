import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import orderModel from "../models/orderModel.js"

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const getUserOrders = async (req, res) => {
  try {
       const userId = req.userId;
       
    const orders = await orderModel.find({  userId }).sort({ date: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(process.env.FRONTEND_URL);
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ app sender
        pass: process.env.EMAIL_PASS, // ✅ app password
      },
    });
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const mailOptions = {
      from: process.env.EMAIL_USER, // ✅ app sends the email
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Valid for 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Reset email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Received token:", token);

    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    console.log("DB token:", user?.resetToken);
    console.log("DB expiry:", user?.resetTokenExpiry);
    if (!user) {
      console.log("No user found or token expired");
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    console.log("User found:", user.email);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
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
const addRecentlyViewed = async (req, res) => {
  const userId = req.userId;
  const { productId } = req.body;

  const user = await userModel.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Avoid duplicates
  if (!user.recentlyViewed.includes(productId)) {
    user.recentlyViewed.unshift(productId);
    if (user.recentlyViewed.length > 10) user.recentlyViewed.pop(); // Keep max 10
    await user.save();
  }

  res.json({ success: true });
};

const getRecentlyViewed = async (req, res) => {
  try {
    console.log("Fetching recently viewed for userId:", req.userId); // ✅

    const user = await userModel.findById(req.userId).populate("recentlyViewed");

    console.log("Found user:", user);
    console.log("Recently viewed products:", user?.recentlyViewed);

    res.json({ success: true, products: user?.recentlyViewed || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching recently viewed products" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("name email address");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const updateUserInfo = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(address && { address })
      },
      { new: true, runValidators: true }
    ).select("name email address");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser, adminLogin, getUserOrders,getUserWishlist,addRecentlyViewed, getRecentlyViewed, forgotPassword, resetPassword,getUserInfo, updateUserInfo };
