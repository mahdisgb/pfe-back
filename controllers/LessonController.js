const db = require("../models");
const { Op } = require("sequelize");
const { cloudinary, upload } = require('../config/cloudinary');

const getList = async (req, res) => {
    try {
        const requestBody = req.query;
        if(Object.keys(requestBody).length === 0){
            const result = await db.Lesson.findAll({ 
                attributes: ["id", "title", "description", "videoUrl", "thumbnailUrl", "duration", "courseId", "professorId", "order", "status", "difficulty", "views", "averageRating", "totalRatings"],
                include: [
                    { model: db.Course, as: 'course', attributes: ['title'] },
                    { model: db.User, as: 'professor', attributes: ['name'] }
                ]
            });
            res.json(result);
            return;
        }
        const filters = Object.keys(requestBody).filter(key => (
            key !== "_start" && key !== "_end" && key !== "_sort" && key !== "_order"
        ));
        const offset = Number(requestBody._start) || 0;
        const query = await db.sequelize.query(`show table status from inventory_management;`);
        const tableSize = Number(query[0].filter(item => item.name = "Lessons")[0].Rows)
        const limit = requestBody._end == 10  ? tableSize : Number(requestBody._end) - offset;

        let whereConditions = {};
        filters.forEach(key => {
            if (!key.includes("_like")) {
                whereConditions[key] = requestBody[key];
            } else {
                const likeKey = key.replace("_like", "");
                if(requestBody[key]){
                    whereConditions[likeKey] = { [Op.like]: `%${requestBody[key]}%` }
                }
            }
        });

        let queryOptions = { 
            offset, 
            limit,
            attributes: ["id", "title", "description", "videoUrl", "thumbnailUrl", "duration", "courseId", "professorId", "order", "status", "difficulty", "views", "averageRating", "totalRatings"],
            include: [
                { model: db.Course, as: 'course', attributes: ['title'] },
                { model: db.User, as: 'professor', attributes: ['name'] }
            ]
        };

        if (requestBody._order && requestBody._sort) {
            queryOptions.order = [[requestBody._sort, requestBody._order.toUpperCase()]];
        }
        if (Object.keys(whereConditions).length > 0) {
            queryOptions.where = whereConditions;
        }

        const result = await db.Lesson.findAll(queryOptions);
        res.json(result);

    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Lesson.create(request);
        res.status(200).send("1")
    }
}

const update = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Lesson.update({ ...request }, { where: { id: request.id } });
        res.status(200).send("1")
    }
}

const deleteOne = async (req, res) => {
    const request = req.body;
    if (Object.keys(request).length < 1) {
        res.status(500).send("request is empty");
        return;
    } else {
        await db.Lesson.destroy({ where: { id: request.id } });
        res.status(200).send("1")
    }
}

/*
const getLesson = async (req, res) => {
    try {
        const lesson = await db.Lesson.findByPk(req.params.id, {
            include: [
                { model: db.Course, as: 'course', attributes: ['title'] },
                { model: db.User, as: 'professor', attributes: ['name'] }
            ]
        });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  // Create a new lesson
 const createLesson = async (req, res) =>{
    try {
      const { title, description, courseId, order, tags, difficulty, prerequisites } = req.body;
      const professorId = req.user._id;

      // Check if course exists
      const course = await db.Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Upload video and thumbnail to cloud storage
      const videoFile = req.files?.video?.[0];
      const thumbnailFile = req.files?.thumbnail?.[0];

      if (!videoFile) {
        return res.status(400).json({ message: 'Video file is required' });
      }

      const [videoUrl, thumbnailUrl] = await Promise.all([
        uploadToCloudinary(videoFile, 'videos'),
        thumbnailFile ? uploadToCloudinary(thumbnailFile, 'thumbnails') : null
      ]);

      const duration = await calculateVideoDuration(videoFile);

      const lesson = new Lesson({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
        course: courseId,
        professor: professorId,
        order,
        tags,
        difficulty,
        prerequisites
      });

      await lesson.save();
      res.status(201).json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error creating lesson', error });
    }
  }

  // Get all lessons for a course
  const getCourseLessons=async (req, res)=> {
    try {
      const { courseId } = req.params;
      const lessons = await db.Lesson.find({ course: courseId })
        .sort({ order: 1 })
        .populate('professor', 'name email')
        .populate('prerequisites', 'title');
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lessons', error });
    }
  }

  // Get a single lesson
//   const getLesson=async (req, res)=> {
//     try {
//       const lesson = await Lesson.findById(req.params.id)
//         .populate('professor', 'name email')
//         .populate('prerequisites', 'title')
//         .populate('comments.user', 'name avatar')
//         .populate('comments.replies.user', 'name avatar');

//       if (!lesson) {
//         return res.status(404).json({ message: 'Lesson not found' });
//       }

//       // Increment views
//       lesson.views += 1;
//       await lesson.save();

//       res.json(lesson);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching lesson', error });
//     }
//   }

  // Update a lesson
  const  updateLesson=async (req, res)=> {
    try {
      const updates = req.body;
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      // Check if user is the professor
      if (lesson.professor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      Object.assign(lesson, updates);
      await lesson.save();
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error updating lesson', error });
    }
  }

  // Delete a lesson
  const deleteLesson=async (req, res)=> {
    try {
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      // Check if user is the professor
      if (lesson.professor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await lesson.remove();
      res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting lesson', error });
    }
  }

  // Add a comment
  const addComment=async (req, res)=> {
    try {
      const { text } = req.body;
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      lesson.comments.push({
        user: req.user._id,
        text
      });

      await lesson.save();
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
  }

  // Add a reply to a comment
  const  addReply=async(req, res)=> {
    try {
      const { commentId, text } = req.body;
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      const comment = lesson.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      comment.replies.push({
        user: req.user._id,
        text
      });

      await lesson.save();
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error adding reply', error });
    }
  }

  // Rate a lesson
  const  rateLesson=async(req, res)=> {
    try {
      const { rating } = req.body;
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      // Update average rating
      const newTotalRatings = lesson.totalRatings + 1;
      const newAverageRating = ((lesson.averageRating * lesson.totalRatings) + rating) / newTotalRatings;

      lesson.averageRating = newAverageRating;
      lesson.totalRatings = newTotalRatings;
      await lesson.save();

      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error rating lesson', error });
    }
  }

  // Update completion rate
  const  updateCompletionRate=async(req, res)=> {
    try {
      const { completionRate } = req.body;
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      lesson.completionRate = completionRate;
      await lesson.save();

      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error updating completion rate', error });
    }
  }
  */
  // Create a new lesson
  const createLesson = async (req, res) => {
    try {
        const { title, description, courseId, order, tags, difficulty, prerequisites } = req.body;
        const videoFile = req.files?.video?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        if (!videoFile) {
            return res.status(400).json({ message: 'Video file is required' });
        }

        const course = await db.Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const lesson = await db.Lesson.create({
            title,
            description,
            courseId,
            professorId: course.professorId,
            order: order || 0,
            videoUrl: videoFile.path,
            thumbnailUrl: thumbnailFile?.path || null,
            tags: tags ? JSON.parse(tags) : [],
            difficulty,
            prerequisites: prerequisites ? JSON.parse(prerequisites) : []
        });

        res.status(201).json(lesson);
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Error creating lesson' });
    }
};
  
  // Get all lessons for a course
  const getCourseLessons = async (req, res) => {
    try {
      const { courseId } = req.params;
      const lessons = await db.Lesson.findAll({
        where: { courseId },
        order: [['order', 'ASC']],
        include: [
          { model: db.User, as: 'professor', attributes: ['firstName','lastName', 'email'] },
          // { model: db.Lesson, as: 'prerequisites', attributes: ['title'] },
        ]
      });
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lessons', error });
    }
  };
  
  // Get a single lesson
  const getLesson = async (req, res) => {
    try {
      const lesson = await db.Lesson.findByPk(req.params.id, {
        include: [
          { model: db.User, as: 'professor', attributes: ['firstName','lastName', 'email'] },
          // { model: db.Lesson, as: 'prerequisites', attributes: ['title'] },
          // {
          //   model: db.Comment,
          //   as: 'comments',
          //   include: [
          //     { model: db.User, as: 'user', attributes: ['name', 'avatar'] },
          //     {
          //       model: db.Reply,
          //       as: 'replies',
          //       include: [{ model: db.User, as: 'user', attributes: ['name', 'avatar'] }]
          //     }
          //   ]
          // }
        ]
      });
  
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
  
      lesson.views += 1;
      await lesson.save();
  
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lesson', error });
    }
  };
  
  // Update a lesson
  const updateLesson = async (req, res) => {
    try {
      const updates = req.body;
      const lesson = await db.Lesson.findByPk(req.params.id);
  
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
  
      if (lesson.professorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      await lesson.update(updates);
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error updating lesson', error });
    }
  };
  
  // Delete a lesson
  const deleteLesson = async (req, res) => {
    try {
      const lesson = await db.Lesson.findByPk(req.params.id);
  
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
  
      if (lesson.professorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      await lesson.destroy();
      res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting lesson', error });
    }
  };
  
  // Add a comment
  const addComment = async (req, res) => {
    try {
      const { text } = req.body;
  
      const lesson = await db.Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
  
      const comment = await db.Comment.create({
        lessonId: lesson.id,
        userId: req.user.id,
        text,
      });
  
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error });
    }
  };
  
  // Add a reply
  const addReply = async (req, res) => {
    try {
      const { commentId, text } = req.body;
  
      const comment = await db.Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const reply = await db.Reply.create({
        commentId: comment.id,
        userId: req.user.id,
        text
      });
  
      res.json(reply);
    } catch (error) {
      res.status(500).json({ message: 'Error adding reply', error });
    }
  };
  
  // Rate a lesson
  const rateLesson = async (req, res) => {
    try {
      const { rating } = req.body;
  
      const lesson = await db.Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
  
      const newTotalRatings = lesson.totalRatings + 1;
      const newAverageRating = ((lesson.averageRating * lesson.totalRatings) + rating) / newTotalRatings;
  
      lesson.totalRatings = newTotalRatings;
      lesson.averageRating = newAverageRating;
  
      await lesson.save();
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error rating lesson', error });
    }
  };
  
  // Update completion rate
  const updateCompletionRate = async (req, res) => {
    try {
      const { completionRate } = req.body;
  
      const lesson = await db.Lesson.findByPk(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
  
      lesson.completionRate = completionRate;
      await lesson.save();
  
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: 'Error updating completion rate', error });
    }
  };
  
  module.exports = {
    createLesson,
    getCourseLessons,
    getLesson,
    updateLesson,
    deleteLesson,
    addComment,
    addReply,
    rateLesson,
    updateCompletionRate,
    getList,
    create,
    update,
    deleteOne  
};
  