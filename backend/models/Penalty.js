const mongoose = require("mongoose");

const penaltySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    borrow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrow",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Penalty",
    penaltySchema
);