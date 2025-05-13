const express = require('express');
const router = express.Router();
const { getProfessorRequests, handleProfessorRequest } = require('../controllers/AdminController');
const adminMiddleware = require('../middleware/admin.middleware');

// router.use(adminMiddleware);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/professor-requests:
 *   get:
 *     summary: Get all professor requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of professor requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                   reason:
 *                     type: string
 *                   adminNotes:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *       403:
 *         description: Unauthorized - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/professor-requests', getProfessorRequests);

/**
 * @swagger
 * /api/admin/professor-requests/{requestId}:
 *   put:
 *     summary: Handle a professor request (approve/reject)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the professor request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: New status for the request
 *               adminNotes:
 *                 type: string
 *                 description: Optional notes from admin
 *     responses:
 *       200:
 *         description: Request processed successfully
 *       400:
 *         description: Request already processed
 *       403:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.put('/professor-requests/:requestId', handleProfessorRequest);

module.exports = router; 