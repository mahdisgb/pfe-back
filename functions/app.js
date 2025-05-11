require('dotenv').config()
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();
const db = require("./models/index");
const UserModel = require('./models/UserModel');
// const ItemModel = require('./models/ItemModel');
// const mainRouter = require('./routers/mainRouter');
const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const courseRouter = require('./routers/courseRouter');
const lessonRouter = require('./routers/lessonRouter');
const courseSubscriptionRouter = require('./routers/courseSubscriptionRouter');
const globalSearchRouter = require('./routers/globalSearchRouter');
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for your application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./functions/routers/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
     credentials: true,
     origin: process.env.FRONT_END,
}))

app.use((req, res, next) => {
     console.log(req.path, req.method)
     next()
});
app.get('/', (req, res) => {
     res.send("home");
})
// app.use("/api/items",mainRouter);
app.use("/api/auth",authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/courses", courseRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/course-subscriptions", courseSubscriptionRouter);
app.use("/api/search", globalSearchRouter);
app.listen(process.env.PORT, async () => {
     try {
          await db.sequelize.authenticate();
          // await UserModel(db.sequelize).truncate();
          // await db.sequelize.sync({force:true});
          // await db.sequelize.sync({ alter: true});
          console.log('Database Connection has been established successfully.');
     } catch (error) {
          console.error('Unable to connect to the database:', error);
          db.sequelize.close();
     }
     console.log(process.env.NODE_ENV, ' Up on port: ', process.env.PORT)
})
// Email content
// const transporter = require('./config/smtp');
// const mailOptions = {
//      from: process.env.SMTP_USER,   // Sender
//      to: 'amillibra2018@gmail.com',    // Recipient
//      subject: 'Hello from Node.js!', // Subject
//      text: 'This is a test email sent from Node.js.', // Plain text
//      // html: '<h1>Hello!</h1><p>This is an HTML email.</p>', // Optional HTML
//    };
   
//    // Send the email
//    transporter.sendMail(mailOptions, (error, info) => {
//      if (error) {
//        console.error('Error sending email:', error);
//      } else {
//        console.log('Email sent:', info.response);
//      }
//    });