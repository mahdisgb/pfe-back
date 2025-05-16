const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

/**
 * @swagger
 * /api/chat/room/{roomId}:
 *   get:
 *     summary: Get messages for a specific room
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: List of messages in the room
 *       500:
 *         description: Server error
 */
router.get('/room/:roomId', ChatController.getRoomMessages);

/**
 * @swagger
 * /api/chat/user/{userId}:
 *   get:
 *     summary: Get all messages for a specific user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's messages
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', ChatController.getUserMessages);

/**
 * @swagger
 * /api/chat/rooms/{userId}:
 *   get:
 *     summary: Get all rooms a user is part of
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of room IDs
 *       500:
 *         description: Server error
 */
router.get('/rooms/:userId', ChatController.getUserRooms);

/**
 * @swagger
 * /api/chat/message/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.delete('/message/:id', ChatController.deleteMessage);

module.exports = router; 