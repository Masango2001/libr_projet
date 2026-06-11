const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getCategories,
    createCategory,
    updateCategory,
    archiveCategory
} = require("../controllers/categoryController");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestion des catégories de livres
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
router.get("/", protect, authorize("member", "librarian"), getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une catégorie
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Catégorie créée
 */
router.post("/", protect, authorize("librarian"), createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Modifier une catégorie
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 */
router.put("/:id", protect, authorize("librarian"), updateCategory);

/**
 * @swagger
 * /api/categories/{id}/archive:
 *   patch:
 *     summary: Archiver une catégorie (soft delete)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catégorie archivée
 */
router.patch("/:id/archive", protect, authorize("librarian"), archiveCategory);

module.exports = router;