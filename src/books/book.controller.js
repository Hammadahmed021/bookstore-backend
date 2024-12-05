const Book = require("./book.model");
const Category = require("../categories/category.model")

const PostBook = async (req, res) => {
  try {
    const { title, description, category, trending, oldPrice, newPrice } = req.body;

    // Find the category by title
    const categoryDoc = await Category.findOne({ title: category });

    if (!categoryDoc) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Use the category's ObjectId
    const categoryObjectId = categoryDoc._id;

    // Ensure file path is added if a file was uploaded
    const coverImage = req.file ? req.file.filename : null;

    const newBook = new Book({
      title,
      description,
      category: categoryObjectId,  // Set the ObjectId reference to Category
      trending,
      coverImage,
      oldPrice,
      newPrice,
    });

    await newBook.save();

    res.status(200).send({ message: "Book posted successfully", book: newBook });
  } catch (error) {
    console.error("Error posting book", error);
    res.status(500).send({ message: "Failed to post book" });
  }
};


const GetAllBooks = async (req, res) => {
  try {
    const getBooks = await Book.find().sort({ createdAt: -1 });
    res.status(200).send(getBooks);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to get books" });
  }
};

const GetBook = async (req, res) => {
  try {
    const { id } = req.params;
    const getBook = await Book.findById(id);
    if (!getBook) {
      res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send(getBook);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({ message: "Failed to get book" });
  }
};

const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the book exists
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return res.status(404).send({ message: "Book not found" });
    }

    // Handle file upload
    const coverImage = req.file ? req.file.filename : existingBook.coverImage;

    // Update the book fields
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        ...req.body, // Update other fields
        coverImage, // Update coverImage
      },
      { new: true } // Return the updated document
    );

    res.status(200).send({
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book", error);
    res.status(500).send({ message: "Failed to update book" });
  }
};

const DeleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const getBook = await Book.findByIdAndDelete(id);
    if (!getBook) {
      res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send({
      message: "Book deleted successfully!",
      book: getBook,
    });
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).send({ message: "Failed to delete book" });
  }
};

module.exports = {
  PostBook,
  GetAllBooks,
  GetBook,
  UpdateBook,
  DeleteBook,
};
