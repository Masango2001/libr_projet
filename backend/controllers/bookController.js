const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

const normalizeBookCopies = (body) => {
    const normalized = { ...body };

    if (normalized.totalCopies !== undefined) {
        normalized.totalCopies = Number(normalized.totalCopies);
    }

    if (normalized.availableCopies !== undefined) {
        normalized.availableCopies = Number(normalized.availableCopies);
    }

    if (
        Number.isFinite(normalized.totalCopies) &&
        normalized.availableCopies === undefined
    ) {
        normalized.availableCopies = normalized.totalCopies;
    }

    if (
        Number.isFinite(normalized.totalCopies) &&
        Number.isFinite(normalized.availableCopies) &&
        normalized.availableCopies > normalized.totalCopies
    ) {
        normalized.availableCopies = normalized.totalCopies;
    }

    return normalized;
};

const getBooks = async (req, res, next) => {
    try {
        const filter = req.user.role === "librarian" ? {} : { isArchived: false };
        const books = await Book.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: books.length,
            data: books
        });

    } catch (error) {
        next(error);
    }
};

const getBookById = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };

        if (req.user.role !== "librarian") {
            filter.isArchived = false;
        }

        const book = await Book.findOne(filter);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        res.json({
            success: true,
            data: book
        });

    } catch (error) {
        next(error);
    }
};

const createBook = async (req, res, next) => {
    try {
        const book = await Book.create(normalizeBookCopies(req.body));

        res.status(201).json({
            success: true,
            data: book
        });

    } catch (error) {
        next(error);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const normalizedBody = normalizeBookCopies(req.body);

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            normalizedBody,
            { returnDocument: "after", runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        res.json({
            success: true,
            data: book
        });

    } catch (error) {
        next(error);
    }
};

const archiveBook = async (req, res, next) => {
    try {
        const activeBorrow = await Borrow.findOne({
            book: req.params.id,
            status: { $in: ["borrowed", "overdue"] }
        });

        if (activeBorrow) {
            return res.status(400).json({
                success: false,
                message: "Impossible d'archiver un livre avec un emprunt actif."
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { isArchived: true },
            { returnDocument: "after", runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        res.json({
            success: true,
            message: "Livre archive avec succes.",
            data: book
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    archiveBook
};
