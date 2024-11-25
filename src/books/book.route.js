const express = require('express');
const { PostBook, GetAllBooks, GetBook, UpdateBook, DeleteBook } = require('./book.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const router = express.Router()

// posting a book 
router.post('/create', authenticateToken ,PostBook)

// get all books 
router.get("/get-all", GetAllBooks)

// signle book 
router.get("/:id", GetBook)

// update book 
router.put("/update/:id", authenticateToken, UpdateBook)

// delete book 
router.delete("/delete/:id",authenticateToken, DeleteBook)

module.exports = router;