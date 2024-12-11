const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');


const port = 3000;
require("dotenv").config();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser()); // Add this line to parse cookies in the request
// Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const bookRoutes = require("./src/books/book.route");
const userRoutes = require("./src/users/user.route");
const orderRoutes = require("./src/orders/order.route");
const categoriesRoutes = require("./src/categories/category.route")
const favoritesRoutes = require("./src/favorites/favorites.route")
const { createAdmin } = require("./src/users/user.controller");

// CORS configuration to allow your frontend (running on http://localhost:5173)
app.use(
  cors({
    origin:  "https://bookstore-frontend-dusky.vercel.app", // Frontend URL (No trailing slash)
    credentials: true, // Allow cookies and credentials to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/category", categoriesRoutes);
app.use('/api/favorites', favoritesRoutes);

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    app.get("/", (req, res) => {
      res.send("Server connected :)");
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

// createAdmin()
main();



