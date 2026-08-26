const gameService = require('../services/gameService');
const userService = require('../services/userService');

const submitGuess = async (req, res) => {
    const { guess, isCS } = req.body
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'You must be logged in.' })
    }

    try {
        const result = await gameService.checkGuess(guess, isCS);

        const currentGameState = req.session.gameState;
        const gameState = !currentGameState || currentGameState.isCS !== Boolean(isCS) ? {
            board: [],
            guesses: [],
            status: 'playing',
            solved: false,
            isCS: Boolean(isCS)
        } : currentGameState;

        gameState.guesses.push(guess);
        gameState.board.push(result.letterArray);

        if (result.isWin) {
            gameState.status = 'won';
            gameState.solved = true;
            await userService.updateStats(userId, true);
        } else if (gameState.guesses.length >= 6) {
            gameState.status = 'lost';
            await userService.updateStats(userId, false);
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