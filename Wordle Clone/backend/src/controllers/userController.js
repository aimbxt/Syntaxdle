const userService = require('../services/userService');

const createLoginSession = (req, user) => {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) {
                return reject(err);
            }

            req.session.user = user;

            req.session.save((err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        });
    });
};

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await userService.registerUser(username, password);
        await createLoginSession(req, result.user);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message || 'Something went wrong'
        });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await userService.loginUser(username, password);
        await createLoginSession(req, result.user);

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            error: err.message || 'Something went wrong'
        });
    }
}

const logout = async (req, res) => {
    req.session.destroy((err, session) => {
        if (err) {
            return res.status(500).json({
                error: 'Logout failed'
            });
        }

        res.clearCookie('connect.sid');
        return res.json({ message: 'Logout successful' })
    })
}

const getSession = (req, res) => {
    console.log(req.session);
    return res.json({
        authenticated: Boolean(req.session.user),
        user: req.session.user || null,
        gameState: req.session.gameState || {
        board: [],
            guesses: [],
            status: 'playing',
            solved: false
        }
    });
};

const getStats = async (req, res) => {
    const userId = req.session.user.id;
    const result = await userService.getStats(userId);

    return res.json(result)
}

module.exports = { register, login, logout, getSession, getStats }