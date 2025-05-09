const express = require('express');
const router = express.Router();
const multer = require('multer');
const lessonController = require('../controllers/LessonController');
// const authMiddleware = require('../middleware/auth.middleware');
// const professorMiddleware = require('../middleware/professor.middleware');
const { videoUpload } = require('../config/cloudinary');
// const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/lessons:
 *   tags:
 *     name: Lessons
 *     description: Lesson management
 */

/**
 * @swagger
 * /api/lessons/course/{courseId}:
 *   get:
 *     summary: Get lessons by course ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The ID of the course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of lessons
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A lesson object
 */

/**
 * @swagger
 * /api/lessons/{id}/comments:
 *   post:
 *     summary: Add a comment to a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */

/**
 * @swagger
 * /api/lessons/{id}/comments/{commentId}/replies:
 *   post:
 *     summary: Add a reply to a comment
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply added
 */

/**
 * @swagger
 * /api/lessons/{id}/rate:
 *   post:
 *     summary: Rate a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rating updated
 */

/**
 * @swagger
 * /api/lessons/{id}/completion:
 *   post:
 *     summary: Update lesson completion rate
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Completion rate updated
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *               - title
 *               - description
 *               - courseId
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The lesson video file
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Optional thumbnail image for the lesson
 *               title:
 *                 type: string
 *                 description: The title of the lesson
 *               description:
 *                 type: string
 *                 description: Detailed description of the lesson
 *               courseId:
 *                 type: integer
 *                 description: ID of the course this lesson belongs to
 *               order:
 *                 type: integer
 *                 description: Order of the lesson in the course
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags for the lesson
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: Difficulty level of the lesson
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of prerequisite lesson IDs
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 videoUrl:
 *                   type: string
 *                 thumbnailUrl:
 *                   type: string
 *                 duration:
 *                   type: integer
 *                 courseId:
 *                   type: integer
 *                 professorId:
 *                   type: integer
 *                 order:
 *                   type: integer
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 difficulty:
 *                   type: string
 *                 prerequisites:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Bad request - missing required fields or invalid data
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson updated
 */

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lesson
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lesson deleted
 */

// Public routes
router.get('/course/:courseId', lessonController.getCourseLessons);
router.get('/:id', lessonController.getLesson);

// Protected routes (require authentication)
// router.use(authMiddleware);

// Student routes
router.post('/:id/comments', lessonController.addComment);
router.post('/:id/comments/:commentId/replies', lessonController.addReply);
router.post('/:id/rate', lessonController.rateLesson);
router.post('/:id/completion', lessonController.updateCompletionRate);

// Professor routes
// router.use(professorMiddleware);

router.post('/', 
  videoUpload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]), 
  lessonController.createLesson
);

router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router; 