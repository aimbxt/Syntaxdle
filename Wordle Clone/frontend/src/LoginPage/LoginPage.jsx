import './LoginPage.css'
import { useState } from 'react'

export default function LoginPage({ loginUser, registerUser }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')

        const trimmedUsername = username.trim()
        const trimmedPassword = password.trim()

        if (!trimmedUsername) {
            setErrorMessage('Please enter a username.')
            return
        }

        if (isSignUp) {
            if (trimmedUsername.length < 3) {
                setErrorMessage('Username must be at least 3 characters long.')
                return
            }

            if (trimmedPassword.length < 8) {
                setErrorMessage('Password must be at least 8 characters long.')
                return
            }

            if (trimmedPassword !== confirmPassword.trim()) {
                setErrorMessage('Passwords do not match.')
                return
            }

            try {
                await registerUser(trimmedUsername, trimmedPassword)
                setUsername('')
                setPassword('')
                setConfirmPassword('')
            } catch (err) {
                setErrorMessage(err.message || 'Unable to create your account right now.')
            }
            return
        }

        if (trimmedUsername.length < 3) {
            setErrorMessage('Username must be at least 3 characters long.')
            return
        }

        if (trimmedPassword.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.')
            return
        }

        try {
            await loginUser(trimmedUsername, trimmedPassword)
            setUsername('')
            setPassword('')
        } catch (err) {
            setErrorMessage(err.message || 'Unable to sign in right now.')
        }
    }

    const toggleMode = () => {
        setIsSignUp((currentMode) => !currentMode)
        setConfirmPassword('')
        setErrorMessage('')
    }

    return (
        <div className="login-page-shell">
            <div className="login-card">
                <div className="login-card__eyebrow">WORDLE</div>
                <h1 className="login-card__title">{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
                <p className="login-card__subtitle">
                    {isSignUp ? 'Set up your details to start playing.' : 'Sign in to continue your streak.'}
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="login-label" htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />

                    <label className="login-label" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    />

                    {isSignUp && (
                        <>
                            <label className="login-label" htmlFor="confirmPassword">Confirm password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </>
                    )}

                    {errorMessage && <p className="login-error-message">{errorMessage}</p>}

                    <button className="login-submit" type="submit">
                        {isSignUp ? 'Create account' : 'Enter'}
                    </button>

                    <button className="login-mode-toggle" type="button" onClick={toggleMode}>
                        {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
                    </button>
                </form>
            </div>
        </div>
    )
}