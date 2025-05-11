const db = require("../models");

const subscribeToCourse = async (req, res) => {
  try {
    const { userId, courseId, email, fullName, cardNumber, cardExpiry, cardCvv } = req.body;

    // Get course details
    const course = await db.Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user already has an active subscription
    const existingSubscription = await db.CourseSubscription.findOne({
      where: {
        userId,
        courseId,
      }
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Already subscribed to this course' });
    }

    // Create subscription record
    // const startDate = new Date();
    // const endDate = new Date();
    // endDate.setFullYear(endDate.getFullYear() + 1); // 1 year access

    const subscription = await db.CourseSubscription.create({
      userId,
      courseId,
      status: 'active',
      paymentMethod: 'edahabia',
      lastPaymentDate: new Date(),
      email,
      fullName,
      cardNumber,
      cardExpiry,
      cardCvv
    });

    res.status(201).json({ subscription });
  } catch (error) {
    console.error('Error subscribing to course:', error);
    res.status(500).json({ error: 'Error subscribing to course' });
  }
};

const checkCourseAccess = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const subscription = await db.CourseSubscription.findOne({
      where: {
        userId,
        courseId,
        status: "active"
      }
    });

    res.json({ hasAccess: !!subscription });
  } catch (error) {
    console.error('Error checking course access:', error);
    res.status(500).json({ error: 'Error checking course access' });
  }
};

const getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscriptions = await db.CourseSubscription.findAll({
      where: { userId },
      include: [
        { 
          model: db.Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'thumbnail']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ error: 'Error fetching subscriptions' });
  }
};

module.exports = {
  subscribeToCourse,
  checkCourseAccess,
  getUserSubscriptions
}; 