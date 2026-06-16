const Author = require("../models/Author");

const getAuthors = async (req, res, next) => {
    try {
        const filter = req.user.role === "librarian" ? {} : { isActive: true };
        const authors = await Author.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: authors.length,
            data: authors
        });

    } catch (error) {
        next(error);
    }
};

const createAuthor = async (req, res, next) => {
    try {
        const author = await Author.create(req.body);

        res.status(201).json({
            success: true,
            data: author
        });

    } catch (error) {
        next(error);
    }
};

const updateAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after", runValidators: true }
        );

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Auteur introuvable."
            });
        }

        res.json({
            success: true,
            data: author
        });

    } catch (error) {
        next(error);
    }
};

const archiveAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { returnDocument: "after", runValidators: true }
        );

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Auteur introuvable."
            });
        }

        res.json({
            success: true,
            message: "Auteur archive avec succes.",
            data: author
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getAuthors, createAuthor, updateAuthor, archiveAuthor };
