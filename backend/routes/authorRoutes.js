const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getAuthors,
    createAuthor,
    updateAuthor,
    archiveAuthor
} = require("../controllers/authorController");

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Récupérer tous les auteurs
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des auteurs
 */
router.get("/", protect, authorize("member", "librarian"), getAuthors);

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Créer un auteur
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Auteur créé
 */
router.post("/", protect, authorize("librarian"), createAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Modifier un auteur
 *     tags: [Authors]
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
 *         description: Auteur modifié
 */
router.put("/:id", protect, authorize("librarian"), updateAuthor);

/**
 * @swagger
 * /api/authors/{id}/archive:
 *   patch:
 *     summary: Archiver un auteur (soft delete)
 *     tags: [Authors]
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
 *         description: Auteur archivé
 */
router.patch("/:id/archive", protect, authorize("librarian"), archiveAuthor);

module.exports = router;