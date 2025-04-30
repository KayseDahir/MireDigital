import Category from "../models/Category.js";

// Get All categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create a new category

// filepath: c:\Users\User\MireDigital\server\controllers\category.js
export const createCategory = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Debugging
    console.log("Uploaded File:", req.file); // Debugging

    const { text, path } = req.body;
    const image = req.file?.path;

    if (!text || !path || !image) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingCategory = await Category.findOne({ path });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this path already exists",
      });
    }

    const newCategory = new Category({
      text,
      path,
      image,
    });
    await newCategory.save();
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error); // Log the error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
