const db = require("../models");
const transporter = require('../config/smtp');

const subscribeToCourse = async (req, res) => {
  try {
    const { userId, courseId, email, fullName, cardNumber, cardExpiry, cardCvv,isFormation } = req.body;

    // Get course details
    if(isFormation){
      const course = await db.Formation.findByPk(courseId, {
      });
      if (!course) {
        return res.status(404).json({ error: 'Formation not found' });
      }
  
      // Check if user already has an active subscription
      const existingSubscription = await db.CourseSubscription.findOne({
        where: {
          userId,
          courseId,
        }
      });
  
      if (existingSubscription) {
        return res.status(400).json({ error: 'Already subscribed to this Formation' });
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
        const subject = 'Formation Subscription Confirmation';
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formation E-Ticket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .ticket {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            border: 2px dashed #ccc;
        }

        .header {
            background-color: #4a90e2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 30px;
        }

        .course-name {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .label {
            font-weight: bold;
            color: #666;
        }

        .value {
            color: #333;
        }

        .access-code {
            background-color: #f8f9fa;
            border: 2px solid #4a90e2;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
        }

        .access-code .code {
            font-size: 18px;
            font-weight: bold;
            color: #4a90e2;
            letter-spacing: 2px;
        }

        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <h1>Formation E-Ticket</h1>
        </div>
        
        <div class="content">
            <div class="course-name">${course.title}</div>
            
            <div class="info-row">
                <span class="label">Student:</span>
                <span class="value">${fullName}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Location:</span>
                <span class="value">${course.location}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">${course.date}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Price:</span>
                <span class="value">${course.price} DZD</span>
            </div>
            
            <div class="access-code">
                <div style="margin-bottom: 5px; font-weight: bold;">Access Code</div>
                <div class="code">${course.id}-${subscription.id}-${Math.floor(Math.random() * 1000)}</div>
            </div>
            
            <div class="footer">
                <p>Login at: ${process.env.FRONT_END}login</p>
                <p>Keep this ticket for your records</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: subject,
          html: html
        });
  
        res.status(201).json({ subscription });
      });
      return
    }
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
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course E-Ticket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .ticket {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            border: 2px dashed #ccc;
        }

        .header {
            background-color: #4a90e2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 30px;
        }

        .course-name {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .label {
            font-weight: bold;
            color: #666;
        }

        .value {
            color: #333;
        }

        .access-code {
            background-color: #f8f9fa;
            border: 2px solid #4a90e2;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
        }

        .access-code .code {
            font-size: 18px;
            font-weight: bold;
            color: #4a90e2;
            letter-spacing: 2px;
        }

        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <h1>Course E-Ticket</h1>
        </div>
        
        <div class="content">
            <div class="course-name">${course.title}</div>
            
            <div class="info-row">
                <span class="label">Student:</span>
                <span class="value">${fullName}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Professor:</span>
                <span class="value">${course.professor.firstName} ${course.professor.lastName}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Price:</span>
                <span class="value">${course.price} DZD</span>
            </div>
            
            <div class="info-row">
                <span class="label">Start Date:</span>
                <span class="value">${new Date().toLocaleDateString()}</span>
            </div>
            
            <div class="access-code">
                <div style="margin-bottom: 5px; font-weight: bold;">Access Code</div>
                <div class="code">${course.id}-${subscription.id}-${Math.floor(Math.random() * 1000)}</div>
            </div>
            
            <div class="footer">
                <p>Login at: ${process.env.FRONT_END}login</p>
                <p>Keep this ticket for your records</p>
            </div>
        </div>
    </div>
</body>
</html>`;

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: html
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