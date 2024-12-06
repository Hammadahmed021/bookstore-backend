const { mongoose } = require("mongoose");
const Order = require("./order.model");
const { sendOrderNotification } = require("../service/sendEmail");

// Controller to create a new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from token payload
    const orderDetails = { ...req.body, userId };

    const order = new Order(orderDetails);
    await order.save();

     // Send order notification to customer and admin
     sendOrderNotification(order);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};
// Controller to get all orders (only for admin or authorized users)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Get all orders from the database
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Controller to get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from request params
    const order = await Order.findById(id); // Find the order by ID

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

const createOrderForGuest = async (req, res) => {
  try {
    const orderDetails = req.body;

    if (!orderDetails.name || !orderDetails.email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required for guest orders",
      });
    }

    const order = new Order(orderDetails);
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// Controller to get orders by userId
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  createOrderForGuest,
  getOrdersByUserId,
};
