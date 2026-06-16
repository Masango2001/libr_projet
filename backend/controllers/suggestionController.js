const Suggestion = require("../models/Suggestion");

const createSuggestion = async (req, res, next) => {
    try {
        const { title, author, comment, message } = req.body;

        const suggestion = await Suggestion.create({
            user: req.user._id,
            title: title || message,
            author,
            comment
        });

        res.status(201).json({
            success: true,
            data: suggestion
        });

    } catch (error) {
        next(error);
    }
};

const getMySuggestions = async (req, res, next) => {
    try {
        const suggestions = await Suggestion.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: suggestions.length,
            data: suggestions
        });

    } catch (error) {
        next(error);
    }
};

const getAllSuggestions = async (req, res, next) => {
    try {
        const suggestions = await Suggestion.find()
            .populate("user")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: suggestions.length,
            data: suggestions
        });

    } catch (error) {
        next(error);
    }
};

const updateSuggestionStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatus = ["pending", "approved", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status de suggestion invalide."
            });
        }

        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after", runValidators: true }
        );

        if (!suggestion) {
            return res.status(404).json({
                success: false,
                message: "Suggestion introuvable."
            });
        }

        res.json({
            success: true,
            data: suggestion
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSuggestion,
    getMySuggestions,
    getAllSuggestions,
    updateSuggestionStatus
};
