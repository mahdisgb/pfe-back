const db = require("../models");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const subscribeToCourse = async (req, res) => {
  try {
    const { userId, courseId, paymentMethodId } = req.body;

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
        status: 'active',
        endDate: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Already subscribed to this course' });
    }

    // Create Stripe customer if not exists
    const user = await db.User.findByPk(userId);
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      await user.update({ stripeCustomerId: customer.id });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // Convert to cents
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/courses/${courseId}/success`
    });

    // Create subscription record
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year access

    const subscription = await db.CourseSubscription.create({
      userId,
      courseId,
      startDate,
      endDate,
      status: 'active',
      paymentMethod: 'stripe',
      lastPaymentDate: new Date(),
      price: course.price
    });

    res.status(201).json({
      subscription,
      clientSecret: paymentIntent.client_secret
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
        status: 'active',
        endDate: {
          [db.Sequelize.Op.gt]: new Date()
        }
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