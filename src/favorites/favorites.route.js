const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("./favorites.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add", authenticateToken, addToWishlist); // Add book to wishlist
router.get("/", authenticateToken, getWishlist); // Get all wishlist items
router.delete("/remove", authenticateToken, removeFromWishlist); // Remove book from wishlist

module.exports = router;
