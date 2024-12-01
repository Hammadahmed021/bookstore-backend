const express = require("express");
const router = express.Router();
const {
    CreateCategory,
    GetCategories,
    GetCategoryById,
    UpdateCategory,
    DeleteCategory,
  } = require("./category.controller");
  const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

// Route to create a category
router.post("/create",authenticateToken, upload.single("image"),  CreateCategory);

// Route to get all categories
router.get("/get-all", GetCategories);

// Route to get a single category by ID
router.get("/:id", GetCategoryById);

// Route to update a category
router.put("/update/:id", UpdateCategory);

// Route to delete a category
router.delete("/:id", DeleteCategory);

module.exports = router;
