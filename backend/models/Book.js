const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    isbn: {
        type: String,
        unique: true,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    totalCopies: {
        type: Number,
        default: 1,
        min: 0
    },

    availableCopies: {
        type: Number,
        default: 1,
        min: 0
    },

    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Book", bookSchema);