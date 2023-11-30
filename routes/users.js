const userController = require('../controllers/user');

const userRoute = require('express').Router();

userRoute.post('/signup', userController.signup);
userRoute.post('/signin', userController.signin);
userRoute.post('/reset-password', userController.resetPassword);
userRoute.post('/new-password', userController.newPassword);
userRoute.get('/allusers', userController.allusers);


module.exports = userRoute;