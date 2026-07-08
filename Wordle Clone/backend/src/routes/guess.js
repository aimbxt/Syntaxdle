const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController');

router.post('/', gameController.submitGuess)

module.exports = router