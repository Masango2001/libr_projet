const Reservation = require("../models/Reservation");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

const getAvailableCopiesForReservation = async (bookId, ignoredReservationId = null) => {
    const approvedFilter = {
        book: bookId,
        status: "approved"
    };

    if (ignoredReservationId) {
        approvedFilter._id = { $ne: ignoredReservationId };
    }

    const [book, approvedReservationsCount] = await Promise.all([
        Book.findById(bookId),
        Reservation.countDocuments(approvedFilter)
    ]);

    if (!book || book.isArchived) {
        return { book, availableCopies: 0 };
    }

    return {
        book,
        availableCopies: book.availableCopies - approvedReservationsCount
    };
};

const createReservation = async (req, res, next) => {
    try {
        const { book } = req.body;

        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Le livre est obligatoire."
            });
        }

        const availability = await getAvailableCopiesForReservation(book);

        if (!availability.book) {
            return res.status(404).json({
                success: false,
                message: "Livre introuvable."
            });
        }

        if (availability.book.isArchived) {
            return res.status(400).json({
                success: false,
                message: "Ce livre est archive et ne peut pas etre reserve."
            });
        }

        if (availability.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                message: "Aucun exemplaire disponible pour reservation."
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

        const activeReservation = await Reservation.findOne({
            user: req.user._id,
            book,
            status: { $in: ["pending", "approved"] }
        });

        if (activeReservation) {
            return res.status(400).json({
                success: false,
                message: "Vous avez deja une reservation active pour ce livre."
            });
        }

        const reservation = await Reservation.create({
            user: req.user._id,
            book,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            data: reservation
        });

    } catch (error) {
        next(error);
    }
};

const getMyReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({
            user: req.user._id
        }).populate("book");

        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });

    } catch (error) {
        next(error);
    }
};

const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find()
            .populate("user")
            .populate("book");

        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });

    } catch (error) {
        next(error);
    }
};

const updateReservationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatus = ["pending", "approved", "cancelled"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status invalide."
            });
        }

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation introuvable."
            });
        }

        if (reservation.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Cette reservation est deja terminee par un emprunt."
            });
        }

        if (reservation.status === "cancelled" && status !== "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Une reservation annulee ne peut plus etre reactivee."
            });
        }

        if (status === "approved") {
            const availability = await getAvailableCopiesForReservation(
                reservation.book,
                reservation._id
            );

            if (!availability.book) {
                return res.status(404).json({
                    success: false,
                    message: "Livre introuvable."
                });
            }

            if (availability.book.isArchived) {
                return res.status(400).json({
                    success: false,
                    message: "Ce livre est archive et ne peut pas etre valide."
                });
            }

            if (availability.availableCopies <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Aucun exemplaire disponible pour valider cette reservation."
                });
            }
        }

        reservation.status = status;
        await reservation.save();

        res.json({
            success: true,
            data: reservation
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservationStatus
};
