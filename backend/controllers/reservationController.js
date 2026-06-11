const Reservation = require("../models/Reservation");

const createReservation = async (req, res) => {
    const data = await Reservation.create({
        user: req.user._id,
        book: req.body.book
    });

    res.status(201).json(data);
};

const getMyReservations = async (req, res) => {
    res.json(await Reservation.find({ user: req.user._id }));
};

const getAllReservations = async (req, res) => {
    res.json(await Reservation.find());
};

const updateReservationStatus = async (req, res) => {
    res.json(await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

module.exports = {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservationStatus
};