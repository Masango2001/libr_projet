const Penalty = require("../models/Penalty");

const getMyPenalties = async (req, res, next) => {
    try {
        const penalties = await Penalty.find({ user: req.user._id })
            .populate("borrow")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: penalties.length,
            data: penalties
        });

    } catch (error) {
        next(error);
    }
};

const getAllPenalties = async (req, res, next) => {
    try {
        const penalties = await Penalty.find()
            .populate("user")
            .populate("borrow")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: penalties.length,
            data: penalties
        });

    } catch (error) {
        next(error);
    }
};

const updatePenaltyStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatus = ["unpaid", "paid"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status de penalite invalide."
            });
        }

        const penalty = await Penalty.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after", runValidators: true }
        );

        if (!penalty) {
            return res.status(404).json({
                success: false,
                message: "Penalite introuvable."
            });
        }

        res.json({
            success: true,
            data: penalty
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getMyPenalties, getAllPenalties, updatePenaltyStatus };
