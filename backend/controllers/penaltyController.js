const Penalty = require("../models/Penalty");

const getMyPenalties = async (req, res) => {
    res.json(await Penalty.find({ user: req.user._id }));
};

const getAllPenalties = async (req, res) => {
    res.json(await Penalty.find());
};

const updatePenaltyStatus = async (req, res) => {
    res.json(await Penalty.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

module.exports = { getMyPenalties, getAllPenalties, updatePenaltyStatus };