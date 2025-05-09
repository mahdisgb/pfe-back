const express = require('express');
const router = express.Router();
const courseSubscriptionController = require('../controllers/CourseSubscriptionController');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/course-subscriptions/subscribe:
 *   post:
 *     summary: Subscribe to a course
 *     tags: [Course Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *               paymentMethodId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created successfully
 */
router.post('/subscribe', authMiddleware, courseSubscriptionController.subscribeToCourse);

/**
 * @swagger
 * /api/course-subscriptions/check/{userId}/{courseId}:
 *   get:
 *     summary: Check if user has access to a course
 *     tags: [Course Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Access status
 */
router.get('/check/:userId/:courseId', authMiddleware, courseSubscriptionController.checkCourseAccess);

/**
 * @swagger
 * /api/course-subscriptions/user/{userId}:
 *   get:
 *     summary: Get all subscriptions for a user
 *     tags: [Course Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of subscriptions
 */
router.get('/user/:userId', authMiddleware, courseSubscriptionController.getUserSubscriptions);

module.exports = router; 