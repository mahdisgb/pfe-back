const db = require("../models");

const ChatController = {
  // Get message history for a room
  getRoomMessages: async (req, res) => {
    try {
      const { roomId } = req.params;
      console.log(req.params)
      const messages = await db.Message.findAll({
        where: { roomId },
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName','email']
        }],
        order: [['timeAdded', 'ASC']],
        limit: 50 // Get last 50 messages
      });

      res.json(messages);
    } catch (error) {
      console.error('Error fetching room messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  },

  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { roomId, userId, content } = req.body;

      // Verify user exists
      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const message = await db.Message.create({
        roomId,
        userId,
        content,
        timeAdded: new Date()
      });

      const newMessage = await db.Message.findOne({
        where: { id: message.id },
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  },

  // Get all messages for a specific user
  getUserMessages: async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(req.params)
      const messages = await db.Message.findAll({
        where: { userId },
        include: [{
          model: db.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        order: [['timeAdded', 'DESC']],
        limit: 50 // Get last 50 messages
      });

      res.json(messages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ error: 'Failed to fetch user messages' });
    }
  },

  // Get all rooms a user is part of
  getUserRooms: async (req, res) => {
    try {
      const { userId } = req.params;
      const rooms = await db.Message.findAll({
        where: { userId },
        attributes: ['roomId'],
        group: ['roomId'],
        raw: true
      });

      res.json(rooms.map(room => room.roomId));
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  },

  // Delete a message
  deleteMessage: async (req, res) => {
    try {
      const { id } = req.params;
      const message = await db.Message.findByPk(id);
      
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      await message.destroy();
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }
};

module.exports = ChatController; 