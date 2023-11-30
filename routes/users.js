const urlController = require('../controllers/url');
const userController = require('../controllers/user');
const authenticate = require('../middleware/auth');

const userRoute = require('express').Router();

userRoute.post('/signup', userController.signup);
userRoute.post('/signin', userController.signin);
userRoute.post('/reset-password', userController.resetPassword);
userRoute.post('/new-password', userController.newPassword);
userRoute.get('/allusers', userController.allusers);

userRoute.post('/url', authenticate, urlController.urlLong);
userRoute.get('/', authenticate,userController.getProfile);

module.exports = userRoute;