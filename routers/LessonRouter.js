const express = require('express');
const router = express.Router();
const multer = require('multer');
const lessonController = require('../controllers/lesson.controller');
const authMiddleware = require('../middleware/auth.middleware');
const professorMiddleware = require('../middleware/professor.middleware');

const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/course/:courseId', lessonController.getCourseLessons);
router.get('/:id', lessonController.getLesson);

// Protected routes (require authentication)
router.use(authMiddleware);

// Student routes
router.post('/:id/comments', lessonController.addComment);
router.post('/:id/comments/:commentId/replies', lessonController.addReply);
router.post('/:id/rate', lessonController.rateLesson);
router.post('/:id/completion', lessonController.updateCompletionRate);

// Professor routes
router.use(professorMiddleware);

router.post('/', 
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]), 
  lessonController.createLesson
);

router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router; 