import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price,discountPrice, quantity, category, subCategory, sizes, bestseller } = req.body

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
            quantity: Number(quantity),           // fixed
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
        console.log(products)
        res.json({success:true,products})

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
        res.json({success:true,product})

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
      quantity,
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
      quantity: Number(quantity),
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



export { listProducts, addProduct, removeProduct, singleProduct,updateProduct }