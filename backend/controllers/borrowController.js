const Borrow = require("../models/Borrow");

const createBorrow = async (req, res) => {
    const borrow = await Borrow.create({
        user: req.user._id,
        book: req.body.book
    });

    res.status(201).json(borrow);
};

const getMyBorrows = async (req, res) => {
    const borrows = await Borrow.find({ user: req.user._id });
    res.json(borrows);
};

const getAllBorrows = async (req, res) => {
    res.json(await Borrow.find().populate("user book"));
};

const returnBook = async (req, res) => {
    const borrow = await Borrow.findByIdAndUpdate(
        req.params.id,
        { status: "returned" },
        { new: true }
    );

    res.json(borrow);
};

module.exports = { createBorrow, getMyBorrows, getAllBorrows, returnBook };