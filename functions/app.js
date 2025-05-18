require('dotenv').config()
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { Server } = require("socket.io");
const http = require("http");
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
const adminRouter = require('./routers/adminRouter');
const commentsRouter = require("./routers/commentsRouter");
const chatRouter = require("./routers/chatRouter");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    try {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.emit('room_joined', { roomId });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  socket.on("leave_room", (roomId) => {
    try {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room: ${roomId}`);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  });

  socket.on("send_message", async (data, callback) => {
    try {
      const { roomId, message, userId, userName } = data;
      console.log('Received message:', { roomId, userId, userName, message });
      
      // Save message to database
      const savedMessage = await db.Message.create({
        roomId,
        userId,
        content: message,
        timeAdded: new Date()
      });

      // Broadcast message to room
      io.to(roomId).emit("receive_message", {
        ...savedMessage.toJSON(),
        userName
      });

      if (callback) callback(null);
    } catch (error) {
      console.error("Error saving message:", error);
      if (callback) callback('Failed to send message');
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

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
        url: process.env.API_URL,
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
app.use("/api/admin", adminRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/chat", chatRouter);
server.listen(process.env.PORT, async () => {
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

// Export both app and server
// module.exports = { app, server };