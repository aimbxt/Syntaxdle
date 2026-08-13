const express = require('express');
const router = express.Router();
const { registerSchema, loginSchema } = require('../validators/userSchemas');
const validate = require('../validators/validate')
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', registerSchema, validate, userController.register);

router.post('/login', loginSchema, validate, userController.login);

router.post('/logout', userController.logout);

router.get('/session', userController.getSession);

router.get('/stats', requireAuth, userController.getStats)

module.exports = router