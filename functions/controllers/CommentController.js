const { Op } = require("sequelize");
const db  = require("../models");

const Comment = db.Comment;
const User = db.User;
const Course = db.Course;
const Lesson = db.Lesson;

const CommentController = {
  // Get all comments
  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["timeAdded", "DESC"]],
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get comments by course
  getCommentsByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const comments = await Comment.findAll({
        where: { courseId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["timeAdded", "DESC"]],
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get comments by lesson
  getCommentsByLesson: async (req, res) => {
    try {
      const { lessonId } = req.params;
      const comments = await Comment.findAll({
        where: { lessonId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["timeAdded", "DESC"]],
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new comment
  createComment: async (req, res) => {
    try {
      const {userId, content, lessonId, courseId } = req.body;

      if (!lessonId && !courseId) {
        return res.status(400).json({ message: "Either lessonId or courseId is required" });
      }

      const comment = await Comment.create({
        content,
        userId,
        lessonId,
        courseId,
      });

      const newComment = await Comment.findOne({
        where: { id: comment.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a comment
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        where: { id, userId },
      });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found or unauthorized" });
      }

      await comment.update({ content });

      const updatedComment = await Comment.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a comment
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        where: { id, userId },
      });

      if (!comment) {
        return res.status(404).json({ message: "Comment not found or unauthorized" });
      }

      await comment.destroy();
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CommentController; 