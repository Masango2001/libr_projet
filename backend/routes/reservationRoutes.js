const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservationStatus
} = require("../controllers/reservationController");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations de livres
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Créer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Réservation créée
 */
router.post("/", protect, authorize("member"), createReservation);

/**
 * @swagger
 * /api/reservations/my:
 *   get:
 *     summary: Voir mes réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations utilisateur
 */
router.get("/my", protect, authorize("member"), getMyReservations);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Voir toutes les réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste globale des réservations
 */
router.get("/", protect, authorize("librarian"), getAllReservations);

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une réservation
 *     tags: [Reservations]
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
 *                 example: approved
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch("/:id/status", protect, authorize("librarian"), updateReservationStatus);

module.exports = router;