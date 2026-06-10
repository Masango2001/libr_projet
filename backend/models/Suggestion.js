const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    author: String,

    comment: String,

    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected"
        ],
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Suggestion",
    suggestionSchema
);