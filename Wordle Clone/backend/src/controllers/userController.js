const userService = require('../services/userService');

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await userService.registerUser(username, password);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || 'Something went wrong'
        });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await userService.loginUser(username, password);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            error: err.message || 'Something went wrong'
        });
    }
}

module.exports = { register, login }