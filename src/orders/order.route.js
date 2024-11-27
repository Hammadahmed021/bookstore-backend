const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  createOrderForGuest,
  getOrdersByUserId,
} = require("./order.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Route to place an order (authenticated)
router.post("/create-order", authenticateToken, createOrder);

// Route to get all orders (only for admin or authorized users)
router.get("/all", authenticateToken, getAllOrders);

// Route to get a specific order by ID
router.get("/:id", authenticateToken, getOrderById);

// Routes for guest users
router.post("/guest-order", createOrderForGuest);

// Routes for user order by id
router.get("/user/:userId", getOrdersByUserId); 

module.exports = router;
