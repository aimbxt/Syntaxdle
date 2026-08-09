const gameService = require('../services/gameService');

const submitGuess = async (req, res) => {
    const { guess } = req.body

    try {
        const result = await gameService.checkGuess(guess);

        const gameState = req.session.gameState || {
            board: [],
            guesses: [],
            status: 'playing',
            solved: false
        };

        gameState.guesses.push(guess);
        gameState.board.push(result.letterArray);

        if (result.isWin) {
            gameState.status = 'won';
            gameState.solved = true;
        } else if (gameState.guesses.length >= 6) {
            gameState.status = 'lost';
        }

        req.session.gameState = gameState;

        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ error: 'Could not save game state' });
            }
        })
        return res.json({ gameState });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message || 'Something went wrong'
        });
    }
}

module.exports = { submitGuess } 