const gameService = require('../services/gameService');

const submitGuess = async (req, res) => {
    const { guess } = req.body

    try {
        const result = await gameService.checkGuess(guess);
        return res.json(result);
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message || 'Something went wrong'
        });
    }
}

module.exports = { submitGuess } 