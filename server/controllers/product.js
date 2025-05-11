import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add product : /api/product/add
import Category from "../models/Category.js"; // Import the Category model

export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    // Resolve category text to ObjectId
    const category = await Category.findOne({
      text: new RegExp(`^${productData.category.trim()}$`, "i"), // Case-insensitive match
    });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    productData.category = category.text;

    // Upload images to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
          folder: "products",
        });
        return result.secure_url;
      })
    );

    // Create the product
    await Product.create({
      ...productData,
      image: imagesUrl,
    });

    res
      .status(200)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Change product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
      inStock: inStock,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Stock updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete product : /api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update product : /api/product/update

export const updateProduct = async (req, res) => {
  try {
    const { id, productData } = req.body;
    const product = await Product.findByIdAndUpdate(id, productData);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
