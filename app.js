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
  apis: ['./routers/*.js'],
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

app.listen(process.env.PORT, async () => {
     try {
          await db.sequelize.authenticate();
          // await UserModel(db.sequelize).truncate();
          // await db.sequelize.sync({force:true});
          await db.sequelize.sync({alter: true});
          console.log('Database Connection has been established successfully.');
     } catch (error) {
          console.error('Unable to connect to the database:', error);
          db.sequelize.close();
     }
     console.log(process.env.NODE_ENV, ' Up on port: ', process.env.PORT)
})