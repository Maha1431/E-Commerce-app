import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import productModel from "../models/productModel.js";



// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
     const userId = req.userId; // Assuming middleware sets req.userId
    const { items, amount, address } = req.body;
    console.log("🟨 Received Order Payload:", req.body);

    // Validate required fields
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create and save order
    const orderData = new orderModel({
  userId,
  items: items.map((item) => ({
    _id: item._id,
    name: item.name,
    description: item.description,
    price: item.price,
    discountPrice: item.discountPrice,
    quantity: item.quantity,
    image: item.image,
    category: item.category,
    subCategory: item.subCategory,
    size: item.size, // the selected size by user
    // ✅ Do NOT include item.sizes
  })),
  amount,
  address,
  status: "placed",
  paymentMethod:"COD",
  payment: false,
  date: Date.now(),
});
    await orderData.save();
    console.log("🟩 Order Saved:", orderData);


    // ✅ Update profile address
    await userModel.findByIdAndUpdate(userId, { address });

    // Update stock for each size
     // ✅ Update stock using atomic MongoDB operator
    for (const item of items) {
      await productModel.updateOne(
        { _id: item._id, "sizes.size": item.size },
        { $inc: { "sizes.$.quantity": -item.quantity } }
      );
    }

    res.status(200).json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    // ✅ Reduce size-wise quantity
   for (const item of items) {
  const product = await productModel.findById(item._id);
  if (!product) continue;

  const sizeIndex = product.sizes.findIndex(
    (s) => s.size === item.size
  );

  if (sizeIndex !== -1 && product.sizes[sizeIndex].quantity >= item.quantity) {
    product.sizes[sizeIndex].quantity -= item.quantity;
    await product.save();
  }
}


    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
     // ✅ Save address to user profile
    await userModel.findByIdAndUpdate(userId, { address });

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}



// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
         const userId = req.userId;
        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export { verifyStripe ,placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus}