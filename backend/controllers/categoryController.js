const Category = require("../models/Category");

const getCategories = async (req, res, next) => {
    try {
        const filter = req.user.role === "librarian" ? {} : { isActive: true };
        const categories = await Category.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };

        if (req.user.role !== "librarian") {
            filter.isActive = true;
        }

        const category = await Category.findOne(filter);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categorie introuvable."
            });
        }

        res.json({
            success: true,
            data: category
        });

    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            data: category
        });

    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after", runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categorie introuvable."
            });
        }

        res.json({
            success: true,
            data: category
        });

    } catch (error) {
        next(error);
    }
};

const archiveCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { returnDocument: "after", runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categorie introuvable."
            });
        }

        res.json({
            success: true,
            message: "Categorie archivee avec succes.",
            data: category
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, archiveCategory };
