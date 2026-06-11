const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getMyPenalties,
    getAllPenalties,
    updatePenaltyStatus
} = require("../controllers/penaltyController");

/**
 * @swagger
 * tags:
 *   name: Penalties
 *   description: Gestion des pénalités (amendes)
 */

/**
 * @swagger
 * /api/penalties/my:
 *   get:
 *     summary: Voir mes pénalités
 *     tags: [Penalties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des pénalités de l'utilisateur
 */
router.get("/my", protect, authorize("member"), getMyPenalties);

/**
 * @swagger
 * /api/penalties:
 *   get:
 *     summary: Voir toutes les pénalités
 *     tags: [Penalties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste globale des pénalités
 */
router.get("/", protect, authorize("librarian"), getAllPenalties);

/**
 * @swagger
 * /api/penalties/{id}:
 *   patch:
 *     summary: Mettre à jour le statut d'une pénalité (paid/unpaid)
 *     tags: [Penalties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: paid
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch("/:id", protect, authorize("librarian"), updatePenaltyStatus);

module.exports = router;