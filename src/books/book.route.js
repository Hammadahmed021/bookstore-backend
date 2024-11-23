const express = require('express');
const { PostBook, GetAllBooks, GetBook, UpdateBook, DeleteBook } = require('./book.controller');
const router = express.Router()

// posting a book 
router.post('/create', PostBook)

// get all books 
router.get("/get-all", GetAllBooks)

// signle book 
router.get("/:id", GetBook)

// update book 
router.put("/update/:id", UpdateBook)

// delete book 
router.delete("/delete/:id", DeleteBook)

module.exports = router;