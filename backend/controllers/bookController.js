const Book = require("../models/Book");

// GET ALL
const getBooks = async (req, res) => {
    const books = await Book.find();
    res.json(books);
};

// GET ONE
const getBookById = async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.json(book);
};

// CREATE
const createBook = async (req, res) => {
    const book = await Book.create(req.body);
    res.status(201).json(book);
};

// UPDATE
const updateBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
};

// ARCHIVE (soft delete)
const archiveBook = async (req, res) => {
    const book = await Book.findByIdAndUpdate(
        req.params.id,
        { isArchived: true },
        { new: true }
    );
    res.json(book);
};

module.exports = { getBooks, getBookById, createBook, updateBook, archiveBook };