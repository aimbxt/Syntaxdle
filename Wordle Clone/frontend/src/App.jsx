import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import './App.css'

import MainGrid from './MainGrid/MainGrid.jsx';
import Keyboard from './Keyboard/Keyboard.jsx';
import PopUp from './PopUp/PopUp.jsx';
import LoginPage from './LoginPage/LoginPage.jsx';
import NavBar from './NavBar/NavBar.jsx';
import ModalManager from './PopUp/ModalManager.jsx';

function App() {
  const createEmptyBoard = () =>
    Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({
        letter: '',
        color: 'lightgray'
      }))
    );

  const [pastGuesses, setPastGuesses] = useState(createEmptyBoard())
  const [currentGuess, setCurrentGuess] = useState("")
  const [isWin, setIsWin] = useState(false)
  const [guessCount, setGuessCount] = useState(0)
  //const [isOpen, setIsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null);
  const [invalidGuess, setInvalidGuess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [gameState, setGameState] = useState({
  board: [],
  guesses: [],
  status: 'playing',
  solved: false
});
  const [playerStats, setPlayerStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [lastGameStatus, setLastGameStatus] = useState('playing');
  const [csMode, setCsMode] = useState(false);

  const normalizeBoard = (boardState) => {
    const board = createEmptyBoard();
    (boardState || []).forEach((row, index) => {
      if (index < board.length) {
        board[index] = row.map((cell) => ({ ...cell }));
      }
    });
    return board;
  };

  const resetGameState = () => {
    setCurrentGuess('');
    setPastGuesses(createEmptyBoard());
    setGuessCount(0);
    setIsWin(false);
    setInvalidGuess(false);
    setActiveModal(null);
    setGameState({
      board: [],
      guesses: [],
      status: 'playing',
      solved: false
    });
  };

  const hydrateGameState = (newGameState) => {
    const nextGuessCount = newGameState.guesses.length || 0;
    const nextIsWin = Boolean(newGameState.solved);

    setGameState(newGameState);
    setPastGuesses(normalizeBoard(newGameState.board));
    setGuessCount(nextGuessCount);
    setIsWin(nextIsWin);

    if (nextGuessCount >= 6 || nextIsWin) {
      setActiveModal('gameOver');
  }
  };

  const loadSessionState = async () => {
    try {
      const response = await fetch('/api/user/session', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('session check failed');
      }

      const data = await response.json();
      const authenticated = Boolean(data.authenticated);
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        resetGameState();
        return;
      }

      if (data.gameState) {
        if (typeof data.gameState.isCS === 'boolean') {
          setCsMode(data.gameState.isCS);
        }
        hydrateGameState(data.gameState);
      } else {
        resetGameState();
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      resetGameState();
    }
  };

  const fetchPlayerStats = async () => {
    if (!isAuthenticated) {
      return;
    }

    setStatsLoading(true);
    try {
      const response = await fetch('api/user/stats', {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setPlayerStats(data);
      setLastGameStatus(gameState.status);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadSessionState();
  }, [])

  useEffect(() => {
    console.log("last:" + lastGameStatus + "current:" + gameState.status + "boolean: " + (lastGameStatus !== gameState.status).toString());
    if (activeModal === 'stats' && (lastGameStatus !== gameState.status)) {
      fetchPlayerStats();
      console.log(playerStats);
    }
  }, [activeModal, gameState, isAuthenticated, playerStats, lastGameStatus])

  useEffect(() => {
  if (isAuthenticated) {
    fetchPlayerStats();
    console.log(playerStats);
  }
}, [isAuthenticated]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (guessCount === 6 || isWin) return
      if (event.repeat) return

      const key = event.key.toUpperCase()

      if (!isAuthenticated) {
        return
      }

      if (/^[A-Z]$/.test(key)) {
        event.preventDefault()
        if (currentGuess.length < 5) {
          editGuess(key)
        }
      } else if (event.key === "Backspace") {
        event.preventDefault()
        editGuess("BACKSPACE")
      } else if (event.key === "Enter") {
        event.preventDefault()
        editGuess("ENTER")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isAuthenticated, currentGuess, guessCount, isWin])

  const registerUser = async (username, password) => {
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
        credentials: 'include'
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setIsAuthenticated(false)
        throw new Error(data.error || data.errors?.[0]?.msg || 'Registration failed')
      }

      setIsAuthenticated(true)
      await loadSessionState()
      return data
    } catch (err) {
      setIsAuthenticated(false)
      throw err
    }
  }

  const loginUser = async (username, password) => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
        credentials: 'include'
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setIsAuthenticated(false)
        throw new Error(data.error || data.errors?.[0]?.msg || 'Login failed')
      }

      if (!data.authenticated) {
        setIsAuthenticated(false)
        throw new Error(data.error || 'Invalid login credentials')
      }

      setIsAuthenticated(true)
      await loadSessionState()
      return data
    } catch (err) {
      setIsAuthenticated(false)
      throw err
    }
  }

  const logoutUser = async () => {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("could not logout");
      }

      setIsAuthenticated(false);
      resetGameState();
    } 

  const toggleMode = () => {
    setCsMode((currentMode) => !currentMode);
    resetGameState();
  };

  const letterStatus = useMemo(() => {
    const status = {}
    pastGuesses.forEach((word) => {
      word.forEach((letter) => {
        if (!letter || !letter.letter) return
        const key = letter.letter.toUpperCase()
        const currentStatus = status[key]
        if (letter.color === "green") {
          status[key] = "green"
        }
        else if (letter.color === "yellow" && currentStatus !== "green") {
          status[key] = "yellow"
        }
        else if (letter.color === "gray" && currentStatus !== "green" && currentStatus !== "yellow") {
          status[key] = "gray"
        }
      })
    })

    return status
  }, [pastGuesses])

  const editGuess = (input) => {
    if (isWin || guessCount === 6) {
      return;
    }
    if (input !== "BACKSPACE" && input !== "ENTER" && !isWin) {
      if (currentGuess.length < 5) {
      setCurrentGuess((currentGuess) => currentGuess + input)
      }
    }
    else if (input === "BACKSPACE" && !isWin) {
      setCurrentGuess((currentGuess) => currentGuess.substring(0, currentGuess.length - 1))
    }
    else if (input === "ENTER" && currentGuess.length === 5 && !isWin) {
        setCurrentGuess("")
        enterWord(currentGuess)
    }
  }
  
  //guess = [{letter: 'A', color: 'gray'}, {letter: 'A', color: 'gray'}, {letter: 'A', color: 'gray'}, {letter: 'A', color: 'gray'}, {letter: 'A', color: 'gray'}]
  const enterWord = async (guess) => {
    if (guessCount === 6 || isWin) {
      return
    }

    const response = await fetch('/api/guess', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({guess : [...guess.toLowerCase()], isCS: csMode})
    })

    const data = await response.json()

    if (!response.ok) {
      setInvalidGuess(true)
      setTimeout(() => setInvalidGuess(false), 300)
      return
    }

    hydrateGameState(data.gameState);
  }



  return (
    <>
      <h1>{csMode ? 'SYNTAXDLE' : 'WORDLE'}</h1>
      {isAuthenticated ? 
      <div> 
        <NavBar logoutUser={logoutUser} openHowToPlay={() => setActiveModal('howToPlay')} openStats={() => setActiveModal('stats')} isCS={csMode} onModeToggle={toggleMode}/>
        <MainGrid pastGuesses={pastGuesses} guessIndex={guessCount} currentGuess={currentGuess} invalidGuess={invalidGuess}/>
        <Keyboard onKeyPress={editGuess} letterStatus={letterStatus}/>
      </div>:
      
      <div>
        <LoginPage loginUser={loginUser} registerUser={registerUser} />
      </div>}

      <ModalManager activeModal={activeModal} onClose={() => setActiveModal(null)} isWin={isWin} guessCount={guessCount} playerStats={playerStats} statsLoading={statsLoading}/>
      
    </>
  )
}

export default App
