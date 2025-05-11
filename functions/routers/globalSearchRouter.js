const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/globalSearchController');

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Global search across courses and lessons
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [course, lesson]
 *         description: Type of content to search (optional)
 *     responses:
 *       200:
 *         description: Search results containing courses and lessons
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
router.get('/', globalSearch);

module.exports = router;