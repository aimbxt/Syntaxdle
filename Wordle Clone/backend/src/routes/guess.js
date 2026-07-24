const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController');
const requireAuth = require('../middleware/requireAuth')

router.post('/', requireAuth, gameController.submitGuess)

module.exports = router