const Book = require("../books/book.model");
const Category = require("./category.model");
const fs = require("fs");
const path = require("path");

// Create a new category
const CreateCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required." });
    }
    // Ensure file path is added if a file was uploaded
    const image = req.file ? req.file.filename : null;

    const newCategory = new Category({
      title,
      image,
    });
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories
const GetCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single category by ID
const GetProductsByCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the category
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // Fetch products that belong to this category
    const products = await Book.find({ category: id });

    res.status(200).json({
      success: true,
      data: {
        category,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a category
const UpdateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
  
      // Check if an image file is provided
      const image = req.file ? req.file.filename : undefined;
  
      // Build the update object
      const updateFields = { title };
      if (image) updateFields.image = image;
  
      // Find and update the category
      const category = await Category.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found." });
      }
  
      // Send the updated category as the response
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Delete a category
const DeleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findByIdAndDelete(id);
  
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found." });
      }
  
      // Delete the image file if it exists
      if (category.image) {
        const imagePath = path.join(__dirname, "uploads/", category.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the image file
        }
      }
  
      res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

module.exports = {
  CreateCategory,
  DeleteCategory,
  GetCategories,
  GetProductsByCategoryById,
  UpdateCategory,
};
