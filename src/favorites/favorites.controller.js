const Favorite = require("./favorites.model");

// Add a book to the wishlist
const addToWishlist = async (req, res) => {
  try {
    console.log('Payload received:', req.body); // Log the payload
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required.',
      });
    }

    const userId = req.user._id;

    // Check if the item already exists in the user's wishlist
    const existingFavorite = await Favorite.findOne({ user: userId, book: bookId });
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'This item is already in your wishlist.',
      });
    }

    // Create a new wishlist entry
    const favorite = await Favorite.create({ user: userId, book: bookId });
    return res.status(201).json({ success: true, favorite });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
};

// Get wishlist for the logged-in user
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ user: userId }).populate('book');
    return res.status(200).json({ success: true, favorites });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
};

// Remove a book from the wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const deleted = await Favorite.findOneAndDelete({ user: userId, book: bookId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Book not found in wishlist' });
    }
    return res.status(200).json({ success: true, message: 'Book removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
