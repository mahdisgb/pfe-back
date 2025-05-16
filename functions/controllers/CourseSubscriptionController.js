const db = require("../models");
const transporter = require('../config/smtp');

const subscribeToCourse = async (req, res) => {
  try {
    const { userId, courseId, email, fullName, cardNumber, cardExpiry, cardCvv } = req.body;

    // Get course details
    const course = await db.Course.findByPk(courseId, {
      include: [{
        model: db.User,
        as: 'professor',
        attributes: ['firstName', 'lastName']
      }]
    });
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

    await db.sequelize.transaction(async (t) => {
      // Create subscription record
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
      }, { transaction: t });

      // Send confirmation email
      const subject = 'Course Subscription Confirmation';
      const text = `Dear ${fullName},\n\n` +
        `Thank you for subscribing to "${course.title}"!\n\n` +
        `Course Details:\n` +
        `- Title: ${course.title}\n` +
        `- Professor: ${course.professor.firstName} ${course.professor.lastName}\n` +
        `- Price: ${course.price} DZD\n\n` +
        `You can now access all course content by logging into your account.\n\n` +
        `If you have any questions, please don't hesitate to contact us.\n\n` +
        `Best regards,\nThe Course Team`;

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        text: text
      });

      res.status(201).json({ subscription });
    });
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
          attributes: ['id', 'title', 'description', 'thumbnail'],
          include: [{
            model: db.User,
            as: 'professor',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
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