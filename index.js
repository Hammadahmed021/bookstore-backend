const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const port = 3000;
require('dotenv').config();

app.use(express.json());

// CORS configuration to allow your frontend (running on http://localhost:5173)
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL (No trailing slash)
  credentials: true, // Allow cookies and credentials to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

const bookRoutes = require("./src/books/book.route");
app.use("/api/book", bookRoutes);

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

main();
