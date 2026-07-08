const pool = require('../db/database');
const bcrypt = require('bcrypt');

const registerUser = async (username, password) => {
    if (!username || !password) {
        const error = new Error("Invalid username or password");
        error.statusCode = 400;
        throw error;
    }
    try {
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            const error = new Error('Username already exists');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        return { user: result.rows[0] }
        //res.status(201).json({ user: result.rows[0]});
    } catch (err) {
        console.error(err);
        if (err.statusCode) {
            throw err;
        }
        
        const error = new Error('Login failed');
        error.statusCode = 500;
        throw error;
    }
}

const loginUser = async (username, password) => {
    if (!username || !password) {
        const error = new Error("Invalid username or password");
        error.statusCode = 400;
        throw error;
    }

    try {
        const existingUser = await pool.query(
            "SELECT id, password_hash FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length === 0) {
            const error = new Error('User does not exist');
            error.statusCode = 400;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, existingUser.rows[0].password_hash);

        if (isMatch) {
            //return res.status(200).json({ authenticated: true, message: "Login successful"});
            return { authenticated: true, message: "Login successful" }
        } else {
            //return res.status(401).json({ authenticated: false, message: "Invalid username or password"});
            const error = new Error("Invalid username or password");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        console.error(err);
        if (err.statusCode) {
            throw err;
        }

        const error = new Error('Login failed');
        error.statusCode = 500;
        throw error;
    }
}

module.exports = { registerUser, loginUser };