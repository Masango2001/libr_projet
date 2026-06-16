const User = require("../models/User");

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable."
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { password, ...safeBody } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            safeBody,
            { returnDocument: "after", runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable."
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const deactivateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { returnDocument: "after", runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur introuvable."
            });
        }

        res.json({
            success: true,
            message: "Utilisateur desactive avec succes.",
            data: user
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, getUserById, updateUser, deactivateUser };
