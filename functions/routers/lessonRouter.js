const express = require('express');
const router = express.Router();
const multer = require('multer');
const {getProfessorLessons,getLesson,getCourseLessons,createLesson,updateLesson,deleteLesson,addComment,addReply,rateLesson,updateCompletionRate,toggleLesson} = require('../controllers/LessonController');
// const authMiddleware = require('../middleware/auth.middleware');
// const professorMiddleware = require('../middleware/professor.middleware');
const { videoUpload,imageUpload } = require('../config/cloudinary');
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


/**
 * @swagger
 * /api/lessons/professor/{professorId}/lessons:
 *   get:
 *     summary: Get professor's lessons
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: professorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Professor ID
 *     responses:
 *       200:
 *         description: List of professor's lessons
 *       500:
 *         description: Server error
 */
router.get('/professor', getProfessorLessons);
router.get('/course/:courseId', getCourseLessons);
router.get('/:id', getLesson);

// Protected routes (require authentication)
// router.use(authMiddleware);

// Student routes
router.post('/:id/comments', addComment);
router.post('/:id/comments/:commentId/replies', addReply);
router.post('/:id/rate', rateLesson);
router.post('/:id/completion', updateCompletionRate);

// Professor routes
// router.use(professorMiddleware);
const handleUploads = (req, res, next) => {
  console.log('Starting handleUploads middleware');
  
  // Create a single multer instance for both uploads
  const upload = multer().fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]);

  upload(req, res, (err) => {
    if (err) {
      console.error('Initial upload error:', err);
      return next(err);
    }

    // Now handle Cloudinary uploads
    if (req.files?.video) {
      videoUpload.single('video')(req, res, (err) => {
        if (err) {
          console.error('Video upload error:', err);
          return next(err);
        }
        
        if (req.files?.thumbnail) {
          imageUpload.single('thumbnail')(req, res, (err) => {
            if (err) {
              console.error('Thumbnail upload error:', err);
              return next(err);
            }
            next();
          });
        } else {
          next();
        }
      });
    } else {
      next();
    }
  });
};

router.post('/',
  // handleUploads,

  videoUpload.fields([{ name: 'video', maxCount: 1 }]),
  // (req, res, next) => {
  //   console.log('After uploads:');
  //   console.log('Body:', req.body);
  //   console.log('Files:', req.files);
  //   next();
  // },
  // (err, req, res, next) => {
  //   if (err instanceof multer.MulterError) {
  //     console.error('Multer error details:', {
  //       code: err.code,
  //       field: err.field,
  //       message: err.message,
  //       storageErrors: err.storageErrors
  //     });
  //     return res.status(400).json({ error: err.message });
  //   }
  //   console.error('Other error:', err);
  //   next(err);
  // },
  createLesson
);


router.put('/:id', updateLesson);
router.post('/toggle', toggleLesson);
router.delete('/:id', deleteLesson);

module.exports = router; 