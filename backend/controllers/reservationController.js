const Reservation = require("../models/Reservation");

// 🔐 CREATE RESERVATION
const createReservation = async (req, res, next) => {
    try {

        const reservation = await Reservation.create({
            user: req.user._id, // JWT
            book: req.body.book,
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

// 📚 GET MY RESERVATIONS
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

// 📊 GET ALL (LIBRARIAN)
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

// 🔄 UPDATE STATUS (SAFE)
const updateReservationStatus = async (req, res, next) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["pending", "approved", "cancelled"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status invalide"
            });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Réservation introuvable"
            });
        }

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