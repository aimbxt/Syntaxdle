const pool = require('../db/database');
const bcrypt = require('bcrypt');

const registerUser = async (username, password) => {
    const normalizedUsername = username?.trim();
    const normalizedPassword = password?.trim();

    if (!normalizedUsername || !normalizedPassword) {
        const error = new Error('Username and password are required.');
        error.statusCode = 400;
        throw error;
    }

    if (normalizedPassword.length < 8) {
        const error = new Error('Password must be at least 8 characters long.');
        error.statusCode = 400;
        throw error;
    }

    try {
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [normalizedUsername]
        );

        if (existingUser.rows.length > 0) {
            const error = new Error('An account with that username already exists.');
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [normalizedUsername, hashedPassword]
        );

        await pool.query(
            `INSERT INTO player_stats (user_id)
             VALUES ($1)`,
            [result.rows[0].id]
        );

        return {
            authenticated: true,
            message: 'Account created successfully.',
            user: result.rows[0]
        };
    } catch (err) {
        console.error(err);
        if (err.statusCode) {
            throw err;
        }

        const error = new Error('Registration failed.');
        error.statusCode = 500;
        throw error;
    }
}

const loginUser = async (username, password) => {
    const normalizedUsername = username?.trim();
    const normalizedPassword = password?.trim();

    if (!normalizedUsername || !normalizedPassword) {
        const error = new Error('Username and password are required.');
        error.statusCode = 400;
        throw error;
    }

    try {
        const existingUser = await pool.query(
            'SELECT id, username, password_hash FROM users WHERE username = $1',
            [normalizedUsername]
        );

        if (existingUser.rows.length === 0) {
            const error = new Error('No account found for that username.');
            error.statusCode = 400;
            throw error;
        }

        const isMatch = await bcrypt.compare(normalizedPassword, existingUser.rows[0].password_hash);

        if (isMatch) {
            return {
                authenticated: true,
                message: 'Login successful.',
                user: {
                    id: existingUser.rows[0].id,
                    username: existingUser.rows[0].username
                }
            };
        }

        const error = new Error('Invalid username or password.');
        error.statusCode = 401;
        throw error;
    } catch (err) {
        console.error(err);
        if (err.statusCode) {
            throw err;
        }

        const error = new Error('Login failed.');
        error.statusCode = 500;
        throw error;
    }
}

const updateStats = async (userId, won) => {
    try {
        await pool.query(
            `INSERT INTO player_stats (user_id)
             VALUES ($1)
             ON CONFLICT (user_id) DO NOTHING`,
            [userId]
        );

        if (won) {
            await pool.query(
                `UPDATE player_stats
                SET 
                games_played = games_played + 1,
                games_won = games_won + 1,
                current_streak = current_streak + 1,
                max_streak = GREATEST(current_streak + 1, max_streak)
                WHERE user_id = $1`, [userId]
            );
        } else {
            await pool.query(
                `UPDATE player_stats
                SET 
                games_played = games_played + 1,
                current_streak = 0
                WHERE user_id = $1`, [userId]
            );
        }
    } catch (err) {
        console.error(err);
        if (err.statusCode) {
            throw err;
        }

        const error = new Error('Stats update failed.');
        error.statusCode = 500;
        throw error;
    }
}

const getStats = async (userId) => {
    try {
        const result = await pool.query(
            `SELECT 
            games_played, games_won, current_streak, max_streak 
            FROM player_stats 
            WHERE user_id = $1`, [userId]);

        if (result.rows.length === 0) {
            const error = new Error('Could not find user');
            error.statusCode = 400;
            throw error;
        }  
        
        return result.rows[0];
    } catch (err) {
        if (err.statusCode) {
            throw err;
        }
        const error = new Error('Could not find user');
        error.statusCode = 500;
        throw error;
    }
}

module.exports = { registerUser, loginUser, updateStats, getStats };