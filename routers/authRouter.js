const { loginUser,registerUser, register, login, logout } = require('../controllers/authController');

const authRouter = require('express').Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);

module.exports = authRouter