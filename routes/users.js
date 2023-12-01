const urlController = require('../controllers/url');
const userController = require('../controllers/user');
const authenticate = require('../middleware/auth');

const userRoute = require('express').Router();

userRoute.post('/signup', userController.signup);
userRoute.post('/signin', userController.signin);
userRoute.post('/reset-password', userController.resetPassword);
userRoute.post('/new-password', userController.newPassword);
userRoute.get('/allusers', userController.allusers);

userRoute.get('/', authenticate ,userController.getProfile);
userRoute.post('/url', authenticate, urlController.urlLong);
userRoute.get('/:shortString', authenticate,urlController.getRedirect);
userRoute.delete('/:shortString', authenticate, urlController.deleteUrl);

module.exports = userRoute;