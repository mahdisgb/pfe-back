const express = require('express');
const router = express.Router();
const {subscribeToCourse,checkCourseAccess,getUserSubscriptions} = require('../controllers/CourseSubscriptionController');

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
router.post('/subscribe', subscribeToCourse);

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
router.get('/check/:userId/:courseId', checkCourseAccess);

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
router.get('/user/:userId', getUserSubscriptions);

module.exports = router; 