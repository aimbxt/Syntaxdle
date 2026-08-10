import './LoginPage.css'
import { useState } from 'react'

export default function LoginPage({ loginUser }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (isSignUp) {
            if (username.length >= 8 && password.length >= 8 && password === confirmPassword) {
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                setIsSignUp(false)
            }
            return
        }

        if (username.length >= 8 && password.length >= 8) {
            loginUser(username, password)
            setUsername('')
            setPassword('')
        }
    }

    const toggleMode = () => {
        setIsSignUp((currentMode) => !currentMode)
        setConfirmPassword('')
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