const express = require('express');
const user = express.Router();
const userController = require('../controllers/userController')
const passport = require('passport')

user.get('/', userController.index)
user.post('/register', userController.register)
user.post('/login', userController.login)
// user.get('/test', passport.authenticate('jwt', {session:false}), userController.test)
module.exports = user