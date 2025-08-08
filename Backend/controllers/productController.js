import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price,discountPrice, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            discountPrice: Number(discountPrice), // fixed
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
       // Filter out sizes with quantity 0
    const filteredProducts = products.map(product => {
      const filteredSizes = product.sizes.filter(size => size.quantity > 0);
      return {
        ...product._doc,
        sizes: filteredSizes
      };
    });
        res.json({success:true,products: filteredProducts})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
            // Filter out zero-quantity sizes
    const filteredSizes = product.sizes.filter(size => size.quantity > 0);

    res.json({
      success: true,
      product: {
        ...product._doc,
        sizes: filteredSizes,
      },
    });
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      sizes,
      bestseller,
      existingImages,
    } = req.body;

    const updateData = {
      name,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice),
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: sizes ? JSON.parse(sizes) : undefined,
    };

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const newImages = [image1, image2, image3, image4];

    // Parse the existing image URLs from frontend
    const prevImages = existingImages ? JSON.parse(existingImages) : [];

    const finalImages = [];

    for (let i = 0; i < 4; i++) {
      if (newImages[i]) {
        const uploaded = await cloudinary.uploader.upload(newImages[i].path, {
          resource_type: "image",
        });
        finalImages[i] = uploaded.secure_url;
      } else {
        finalImages[i] = prevImages[i] || null;
      }
    }

    updateData.image = finalImages;

    // Clean up
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ success: true, message: "Product Updated", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
 const rateProduct = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const product = await productModel.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user has already rated
    const existingRating = product.ratings.find(
      (r) => r.userId.toString() === userId
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      // Add new rating
      product.ratings.push({ userId, rating, comment });
    }

   await product.save({ validateBeforeSave: false }); // ✅ Skip full validation

    res.status(200).json({ message: "Rating submitted", ratings: product.ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { listProducts, addProduct, removeProduct, singleProduct,updateProduct,rateProduct }