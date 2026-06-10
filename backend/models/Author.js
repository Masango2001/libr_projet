const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    biography: String,

    nationality: String,

    birthDate: Date,

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Author", authorSchema);