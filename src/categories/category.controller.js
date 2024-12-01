const Category = require("./category.model");


// Create a new category
const CreateCategory = async (req, res) => {
    try {
        const { title, image } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required." });
        }

        const category = await Category.create({ title, image });
        res.status(201).json({ success: true, data: category });
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
const GetCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a category
const UpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { title, image },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

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

        res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { CreateCategory, DeleteCategory, GetCategories, GetCategoryById, UpdateCategory }