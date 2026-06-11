const User = require("../models/User");

const getUsers = async (req, res) => {
    res.json(await User.find());
};

const getUserById = async (req, res) => {
    res.json(await User.findById(req.params.id));
};

const updateUser = async (req, res) => {
    res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

const deactivateUser = async (req, res) => {
    res.json(await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    ));
};

module.exports = { getUsers, getUserById, updateUser, deactivateUser };