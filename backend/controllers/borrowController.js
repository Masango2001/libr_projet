const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Penalty = require("../models/Penalty");

const DEFAULT_BORROW_DURATION_DAYS = 14;

/**
 * 📌 EMPRUNTER UN LIVRE
 */
const createBorrow = async (req, res, next) => {
    try {
        const { book, dueDate } = req.body;

        // Validation
        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Le livre est obligatoire."
            });
        }

        // Vérifier livre
        const existingBook = await Book.findById(book);

        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        // Vérifier disponibilité
        if (existingBook.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: "Aucun exemplaire disponible."
            });
        }

        const normalizedDueDate = dueDate
            ? new Date(dueDate)
            : new Date(Date.now() + DEFAULT_BORROW_DURATION_DAYS * 24 * 60 * 60 * 1000);

        if (Number.isNaN(normalizedDueDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "La date de retour (dueDate) est invalide."
            });
        }

        // Création borrow
        const borrow = await Borrow.create({
            user: req.user._id,
            book,
            dueDate: normalizedDueDate
        });

        // Décrémenter stock
        existingBook.availableCopies -= 1;
        await existingBook.save();

        res.status(201).json({
            success: true,
            message: "Livre emprunté avec succès.",
            data: borrow
        });

    } catch (error) {
        next(error);
    }
};


/**
 * 📌 MES EMPRUNTS
 */
const getMyBorrows = async (req, res, next) => {
    try {
        const borrows = await Borrow.find({ user: req.user._id })
            .populate("book")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: borrows.length,
            data: borrows
        });

    } catch (error) {
        next(error);
    }
};


/**
 * 📌 TOUS LES EMPRUNTS (librarian)
 */
const getAllBorrows = async (req, res, next) => {
    try {
        const borrows = await Borrow.find()
            .populate("user")
            .populate("book")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: borrows.length,
            data: borrows
        });

    } catch (error) {
        next(error);
    }
};


/**
 * 📌 RETOUR LIVRE + PÉNALITÉ
 */
const returnBook = async (req, res, next) => {
    try {

        const borrow = await Borrow.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({
                success: false,
                message: "Emprunt introuvable."
            });
        }

        // 🔐 sécurité
        if (
            borrow.user.toString() !== req.user._id.toString() &&
            req.user.role !== "librarian"
        ) {
            return res.status(403).json({
                success: false,
                message: "Accès refusé."
            });
        }

        if (borrow.status === "returned") {
            return res.status(400).json({
                success: false,
                message: "Livre déjà retourné."
            });
        }

        // 📅 retour
        const returnDate = new Date();
        borrow.returnDate = returnDate;
        borrow.status = "returned";

        const dueDate = new Date(borrow.dueDate);

        let penaltyAmount = 0;

        // 📊 calcul pénalité
        if (returnDate > dueDate) {
            const diffTime = returnDate - dueDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            penaltyAmount = diffDays * 500;
        }

        await borrow.save();

        // 📚 remettre stock
        const book = await Book.findById(borrow.book);

        if (book) {
            book.availableCopies += 1;

            // 🛡️ protection incohérence stock
            if (book.availableCopies > book.totalCopies) {
                book.availableCopies = book.totalCopies;
            }

            await book.save();
        }

        // 💰 créer pénalité
        if (penaltyAmount > 0) {
            await Penalty.create({
                user: borrow.user,
                borrow: borrow._id,
                amount: penaltyAmount,
                status: "unpaid"
            });
        }

        res.json({
            success: true,
            message: penaltyAmount > 0
                ? `Retour effectué avec pénalité ${penaltyAmount} F`
                : "Retour effectué sans pénalité",
            data: borrow
        });

    } catch (error) {
        next(error);
    }
};


/**
 * 📌 EXPORT
 */
module.exports = {
    createBorrow,
    getMyBorrows,
    getAllBorrows,
    returnBook
};