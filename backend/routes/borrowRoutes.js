const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createBorrow,
    getMyBorrows,
    getAllBorrows,
    returnBook
} = require("../controllers/borrowController");

/**
 * @swagger
 * tags:
 *   name: Borrows
 *   description: Gestion des emprunts de livres
 */

/**
 * @swagger
 * /api/borrows:
 *   post:
 *     summary: Créer un emprunt (borrow)
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Emprunt créé
 */
router.post("/", protect, authorize("member"), createBorrow);

/**
 * @swagger
 * /api/borrows/my:
 *   get:
 *     summary: Voir mes emprunts
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des emprunts utilisateur
 */
router.get("/my", protect, authorize("member"), getMyBorrows);

/**
 * @swagger
 * /api/borrows:
 *   get:
 *     summary: Voir tous les emprunts
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste globale des emprunts
 */
router.get("/", protect, authorize("librarian"), getAllBorrows);

/**
 * @swagger
 * /api/borrows/{id}/return:
 *   patch:
 *     summary: Retourner un livre
 *     tags: [Borrows]
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
 *         description: Livre retourné avec succès
 */
router.patch("/:id/return", protect, authorize("member", "librarian"), returnBook);

module.exports = router;