const Author = require("../models/Author");

const getAuthors = async (req, res) => {
    res.json(await Author.find());
};

const createAuthor = async (req, res) => {
    res.json(await Author.create(req.body));
};

const updateAuthor = async (req, res) => {
    res.json(await Author.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

const archiveAuthor = async (req, res) => {
    res.json(await Author.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }));
};

module.exports = { getAuthors, createAuthor, updateAuthor, archiveAuthor };