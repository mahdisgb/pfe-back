const db = require('../models');

const checkCourseAccess = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is the course creator
    const course = await db.Course.findByPk(courseId);
    if (course.professorId === userId) {
      return next();
    }

    // Check for active subscription
    const subscription = await db.CourseSubscription.findOne({
      where: {
        userId,
        courseId,
        status: 'active',
        endDate: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!subscription) {
      return res.status(403).json({ 
        error: 'Subscription required',
        message: 'Please subscribe to access this course'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking course access:', error);
    res.status(500).json({ error: 'Error checking course access' });
  }
};

module.exports = checkCourseAccess; 