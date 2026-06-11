const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createSuggestion,
    getMySuggestions,
    getAllSuggestions,
    updateSuggestionStatus
} = require("../controllers/suggestionController");

/**
 * @swagger
 * tags:
 *   name: Suggestions
 *   description: Gestion des suggestions des utilisateurs
 */

/**
 * @swagger
 * /api/suggestions:
 *   post:
 *     summary: Créer une suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Suggestion créée
 */
router.post("/", protect, authorize("member"), createSuggestion);

/**
 * @swagger
 * /api/suggestions/my:
 *   get:
 *     summary: Voir mes suggestions
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des suggestions de l'utilisateur
 */
router.get("/my", protect, authorize("member"), getMySuggestions);

/**
 * @swagger
 * /api/suggestions:
 *   get:
 *     summary: Voir toutes les suggestions
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste globale des suggestions
 */
router.get("/", protect, authorize("librarian"), getAllSuggestions);

/**
 * @swagger
 * /api/suggestions/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une suggestion
 *     tags: [Suggestions]
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
 *                 example: reviewed
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch("/:id/status", protect, authorize("librarian"), updateSuggestionStatus);

module.exports = router;