const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true,
    },
    trending: {
        type: Boolean,
        required: true,
    },
    coverImage: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;