const express = require("express");
const router = express.Router();
const {
    CreateCategory,
    GetCategories,
    UpdateCategory,
    DeleteCategory,
    GetProductsByCategoryById,
  } = require("./category.controller");
  const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware');

// Route to create a category
router.post("/create",authenticateToken, upload.single("image"),  CreateCategory);

// Route to get all categories
router.get("/get-all", GetCategories);

// Route to get a single category by ID
router.get("/:id", GetProductsByCategoryById);

// Route to update a category
router.post("/update/:id", authenticateToken, upload.single("image"), UpdateCategory);


// Route to delete a category
router.delete("/:id",authenticateToken, DeleteCategory);

module.exports = router;
