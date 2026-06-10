const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    isbn: {
        type: String,
        unique: true
    },

    description: String,

    totalCopies: {
        type: Number,
        default: 1
    },

    availableCopies: {
        type: Number,
        default: 1
    },

    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Book", bookSchema);