const Suggestion = require("../models/Suggestion");

const createSuggestion = async (req, res) => {
    const data = await Suggestion.create({
        user: req.user._id,
        message: req.body.message
    });

    res.status(201).json(data);
};

const getMySuggestions = async (req, res) => {
    res.json(await Suggestion.find({ user: req.user._id }));
};

const getAllSuggestions = async (req, res) => {
    res.json(await Suggestion.find());
};

const updateSuggestionStatus = async (req, res) => {
    res.json(await Suggestion.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

module.exports = {
    createSuggestion,
    getMySuggestions,
    getAllSuggestions,
    updateSuggestionStatus
};