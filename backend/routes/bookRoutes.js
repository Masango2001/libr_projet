const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    archiveBook
} = require("../controllers/bookController");

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Récupérer tous les livres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste des livres
 */
router.get("/", protect, authorize("member", "librarian"), getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Récupérer un livre par ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Livre trouvé
 */
router.get("/:id", protect, authorize("member", "librarian"), getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Créer un livre
 *     tags: [Books]
 */
router.post("/", protect, authorize("librarian"), createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Modifier un livre
 *     tags: [Books]
 */
router.put("/:id", protect, authorize("librarian"), updateBook);

/**
 * @swagger
 * /api/books/{id}/archive:
 *   patch:
 *     summary: Archiver un livre (soft delete)
 *     tags: [Books]
 */
router.patch("/:id/archive", protect, authorize("librarian"), archiveBook);

module.exports = router;