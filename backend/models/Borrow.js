const mongoose = require("mongoose");

const DEFAULT_BORROW_DURATION_DAYS = 14;

const borrowSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },

    borrowDate: {
        type: Date,
        default: Date.now
    },

    dueDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + DEFAULT_BORROW_DURATION_DAYS * 24 * 60 * 60 * 1000)
    },

    returnDate: Date,

    status: {
        type: String,
        enum: ["borrowed", "returned", "overdue"],
        default: "borrowed"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Borrow", borrowSchema);
