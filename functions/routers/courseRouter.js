const express = require('express');
const router = express.Router();
const { imageUpload, videoUpload } = require('../config/cloudinary');
const { getList, create, update, deleteOne, getCourse, getProfessorCourses,toggleCourse } = require('../controllers/CourseController');
// const authMiddleware = require('../middleware/auth.middleware');
const checkCourseAccess = require('../middleware/courseAccess.middleware');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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
 *         description: List of courses
 *       500:
 *         description: Server error
 */
router.get('/', getList);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
// router.get('/:id', checkCourseAccess, getCourse);
router.get('/:id', getCourse);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               professorId:
 *                 type: integer
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course created successfully
 *       500:
 *         description: Server error
 */
router.post('/', imageUpload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), create);

/**
 * @swagger
 * /api/courses:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *               content:
 *                 type: string
 *               document:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       500:
 *         description: Server error
 */
router.put('/', imageUpload.fields([
  { name: 'thumbnail', maxCount: 1 }
]), update);

/**
 * @swagger
 * /api/courses:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/', deleteOne);

/**
 * @swagger
 * /api/courses/professor/{professorId}:
 *   get:
 *     summary: Get courses by professor ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Professor ID
 *     responses:
 *       200:
 *         description: List of professor's courses
 *       500:
 *         description: Server error
 */
router.get('/professor/:professorId', getProfessorCourses);

/**
 * @swagger
 * /api/courses/toggle-active:
 *   post:
 *     summary: Toggle course active status
 *     tags: [Courses]
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
 *         description: Course active status toggled successfully
 *       500:
 *         description: Server error
 */
router.post('/toggle', toggleCourse);

module.exports = router; 