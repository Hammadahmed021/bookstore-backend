const Order = require("./order.model");


// Controller to create a new order
const createOrder = async (req, res) => {
  try {
    const orderDetails = req.body; // Get order details from request body
    const order = new Order(orderDetails); // Create a new order from the details

    await order.save(); // Save the order to the database

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
    const { orderId } = req.params; // Get the order ID from request params
    const order = await Order.findById(orderId); // Find the order by ID

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

module.exports = { createOrder, getAllOrders, getOrderById };
