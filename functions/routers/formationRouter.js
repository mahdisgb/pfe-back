const express = require('express');
const router = express.Router();
const { imageUpload } = require('../config/cloudinary');
const { 
  getAllFormations, 
  searchFormations, 
  getFormationById, 
  createFormation, 
  updateFormation, 
  deleteFormation,
  getProfessorFormations,
  toggleFormation
} = require('../controllers/FormationController');

/**
 * @swagger
 * /api/formations:
 *   get:
 *     summary: Get all formations
 *     tags: [Formations]
 *     parameters:
 *       - in: query
 *         name: _start
 *         schema:
 *           type: integer
 *         description: Start index for pagination
 *       - in: query
 *         name: _end
 *         schema:
 *           type: integer
 *         description: End index for pagination
 *       - in: query
 *         name: _sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *         description: Sort order (ASC/DESC)
 *     responses:
 *       200:
 *         description: List of formations
 *       500:
 *         description: Server error
 */
router.get('/', getAllFormations);

/**
 * @swagger
 * /api/formations/{id}:
 *   get:
 *     summary: Get a formation by ID
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Formation ID
 *     responses:
 *       200:
 *         description: Formation details
 *       404:
 *         description: Formation not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getFormationById);

/**
 * @swagger
 * /api/formations:
 *   post:
 *     summary: Create a new formation
 *     tags: [Formations]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               professorId:
 *                 type: integer
 *               location:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Formation created successfully
 *       500:
 *         description: Server error
 */
router.post('/', imageUpload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), createFormation);

/**
 * @swagger
 * /api/formations:
 *   put:
 *     summary: Update a formation
 *     tags: [Formations]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               location:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Formation updated successfully
 *       500:
 *         description: Server error
 */
router.put('/', imageUpload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), updateFormation);

/**
 * @swagger
 * /api/formations:
 *   delete:
 *     summary: Delete a formation
 *     tags: [Formations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Formation deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/', deleteFormation);

/**
 * @swagger
 * /api/formations/professor/{professorId}:
 *   get:
 *     summary: Get formations by professor ID
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Professor ID
 *     responses:
 *       200:
 *         description: List of professor's formations
 *       500:
 *         description: Server error
 */
router.get('/professor/:professorId', getProfessorFormations);

/**
 * @swagger
 * /api/formations/toggle:
 *   post:
 *     summary: Toggle formation active status
 *     tags: [Formations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Formation active status toggled successfully
 *       500:
 *         description: Server error
 */
router.post('/toggle', toggleFormation);

module.exports = router; 