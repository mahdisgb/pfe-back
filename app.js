require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./models/index");
const UserModel = require('./models/UserModel');
// const ItemModel = require('./models/ItemModel');
// const mainRouter = require('./routers/mainRouter');
const authRouter = require('./routers/authRouter');
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

app.listen(process.env.PORT, async () => {
     try {
          await db.sequelize.authenticate();
          // await UserModel(db.sequelize).truncate();
          // await UserModel(db.sequelize).sync({force:true});
          // await ItemModel(db.sequelize).sync({force:true});
          // await db.sequelize.sync({force:true});
          console.log('Database Connection has been established successfully.');
     } catch (error) {
          console.error('Unable to connect to the database:', error);
          db.sequelize.close();
     }
     console.log(process.env.NODE_ENV, ' Up on port: ', process.env.PORT)
})