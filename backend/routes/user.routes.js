const express = require('express');
const auth = require('../middleware/authorization');
const { createUser, login, verifyUser, logout, updateUser, refreshToken } = require('../controllers/user.controller');
const { validateRegister, validateLogin, handleValidation, validateUserUpdate } = require('../middleware/validators');

const userRouter = express.Router();

userRouter.post('/create', validateRegister, handleValidation, createUser);
userRouter.post('/login', validateLogin, handleValidation, login);
userRouter.post('/refresh', refreshToken);
userRouter.get('/verify-user', auth, verifyUser);
userRouter.put('/update', auth, validateUserUpdate, handleValidation, updateUser);
userRouter.post('/logout', logout);

module.exports = userRouter;