const Category = require("../models/Category");

const getCategories = async (req, res) => {
    res.json(await Category.find());
};

const createCategory = async (req, res) => {
    res.json(await Category.create(req.body));
};

const updateCategory = async (req, res) => {
    res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

const archiveCategory = async (req, res) => {
    res.json(await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }));
};

module.exports = { getCategories, createCategory, updateCategory, archiveCategory };