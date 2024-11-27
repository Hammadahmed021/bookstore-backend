const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make userId optional for guest orders
      default: null,
    }, // You can also set the default value to null if you want},
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: {
      address: { type: String },
      city: { type: String },
      country: { type: String },
      state: { type: String },
      zipcode: { type: String },
    },
    products: [
      {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
