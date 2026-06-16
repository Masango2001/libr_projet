const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Penalty = require("../models/Penalty");
const Reservation = require("../models/Reservation");

const DEFAULT_BORROW_DURATION_DAYS = 14;
const PENALTY_AMOUNT_PER_DAY = 500;

const markOverdueBorrows = async (filter = {}) => {
    await Borrow.updateMany(
        {
            ...filter,
            status: "borrowed",
            dueDate: { $lt: new Date() }
        },
        { status: "overdue" }
    );
};

const createBorrow = async (req, res, next) => {
    try {
        const { book, dueDate, reservation: reservationId } = req.body;

        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Le livre est obligatoire."
            });
        }

        const existingBook = await Book.findById(book);

        if (!existingBook) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        if (existingBook.isArchived) {
            return res.status(400).json({
                success: false,
                message: "Ce livre est archive et ne peut pas etre emprunte."
            });
        }

        const activeBorrow = await Borrow.findOne({
            user: req.user._id,
            book,
            status: { $in: ["borrowed", "overdue"] }
        });

        if (activeBorrow) {
            return res.status(400).json({
                success: false,
                message: "Vous avez deja un emprunt actif pour ce livre."
            });
        }

        const reservationFilter = reservationId
            ? { _id: reservationId, user: req.user._id, book }
            : { user: req.user._id, book, status: "approved" };

        const approvedReservation = await Reservation.findOne(reservationFilter);

        if (!approvedReservation || approvedReservation.status !== "approved") {
            return res.status(400).json({
                success: false,
                message: "Vous devez avoir une reservation approuvee avant d'emprunter ce livre."
            });
        }

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

        if (normalizedDueDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "La date de retour doit etre dans le futur."
            });
        }

        const borrow = await Borrow.create({
            user: req.user._id,
            book,
            dueDate: normalizedDueDate
        });

        existingBook.availableCopies -= 1;
        await existingBook.save();

        approvedReservation.status = "completed";
        await approvedReservation.save();

        res.status(201).json({
            success: true,
            message: "Livre emprunte avec succes.",
            data: borrow
        });

    } catch (error) {
        next(error);
    }
};

const getMyBorrows = async (req, res, next) => {
    try {
        await markOverdueBorrows({ user: req.user._id });

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

const getAllBorrows = async (req, res, next) => {
    try {
        await markOverdueBorrows();

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

const returnBook = async (req, res, next) => {
    try {
        await markOverdueBorrows({ _id: req.params.id });

        const borrow = await Borrow.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({
                success: false,
                message: "Emprunt introuvable."
            });
        }

        if (
            borrow.user.toString() !== req.user._id.toString() &&
            req.user.role !== "librarian"
        ) {
            return res.status(403).json({
                success: false,
                message: "Acces refuse."
            });
        }

        if (borrow.status === "returned") {
            return res.status(400).json({
                success: false,
                message: "Livre deja retourne."
            });
        }

        const returnDate = new Date();
        borrow.returnDate = returnDate;
        borrow.status = "returned";

        const dueDate = new Date(borrow.dueDate);
        let penaltyAmount = 0;

        if (returnDate > dueDate) {
            const diffTime = returnDate - dueDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            penaltyAmount = diffDays * PENALTY_AMOUNT_PER_DAY;
        }

        await borrow.save();

        const book = await Book.findById(borrow.book);

        if (book) {
            book.availableCopies += 1;

            if (book.availableCopies > book.totalCopies) {
                book.availableCopies = book.totalCopies;
            }

            await book.save();
        }

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
                ? `Retour effectue avec penalite ${penaltyAmount} F`
                : "Retour effectue sans penalite",
            data: borrow
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBorrow,
    getMyBorrows,
    getAllBorrows,
    returnBook
};
