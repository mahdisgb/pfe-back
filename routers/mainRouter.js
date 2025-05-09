// const { getList, create, update, deleteOne } = require('../controllers/ItemController');

// const mainRouter = require('express').Router();

// mainRouter.get("/", getList);
// mainRouter.post("/", create);
// mainRouter.put("/", update);
// mainRouter.patch("/", update);
// mainRouter.delete("/", deleteOne);

// module.exports = mainRouter

const express = require('express');
const router = express.Router();
const courseRouter = require('./courseRouter');
const lessonRouter = require('./lessonRouter');
const categoryRouter = require('./categoryRouter');
const authRouter = require('./authRouter');
const courseSubscriptionRouter = require('./courseSubscriptionRouter');

router.use('/courses', courseRouter);
router.use('/lessons', lessonRouter);
router.use('/categories', categoryRouter);
router.use('/auth', authRouter);
router.use('/course-subscriptions', courseSubscriptionRouter);

module.exports = router;