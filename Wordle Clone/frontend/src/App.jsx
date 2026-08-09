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

  const normalizeBoard = (boardState) => {
    const board = createEmptyBoard();
    (boardState || []).forEach((row, index) => {
      if (index < board.length) {
        board[index] = row.map((cell) => ({ ...cell }));
      }
    });
    return board;
  };

  useEffect(() => {
    console.log(activeModal)
    const checkSession = async () => {
      const response = await fetch('/api/user/session', {
        credentials: 'include'
      });

      const data = await response.json();
      setIsAuthenticated(data.authenticated);

      if (data.gameState) {
        setGameState(data.gameState);
        setPastGuesses(normalizeBoard(data.gameState.board));
        setGuessCount(data.gameState.guesses.length || 0);
        setIsWin(data.gameState.solved || false);
      }
    };

    checkSession();
  }, [])
  
  useEffect(() => {
    if (guessCount === 6 || isWin) {
      setActiveModal('gameOver');
    }
    else {
      if (activeModal === 'gameOver')
        setActiveModal(null);
    }
  }, [guessCount, isWin]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (guessCount === 6 || isWin) return
      if (event.repeat) return
      const key = event.key.toUpperCase()
      // letters
      if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < 5) {
          editGuess(key)
        }
      }
      // backspace
      else if (event.key === "Backspace") {
        editGuess("BACKSPACE")
      }
      // enter
      else if (event.key === "Enter") {
        editGuess("ENTER")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentGuess, guessCount, isWin])

  const loginUser = async (username, password) => {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
        credentials: "include"
      })

      if (!response.ok) {
        setIsAuthenticated(false)
        throw new Error("invalid login")
      }

      const {authenticated} = await response.json()
      setIsAuthenticated(authenticated)
      if (!authenticated) {throw new Error("invalid login credentials")}

      return authenticated
    }
    catch (err) {
      setIsAuthenticated(false);
      throw err;
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
    } 

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

  useEffect(() => {
    let temp = Math.max(0, guessCount - 1)
    console.log(currentGuess)
    console.log(pastGuesses)
    console.log(`isWin: ${isWin}`)
    console.log(pastGuesses[temp])
    console.log(letterStatus)
    console.log(activeModal)
  }, [currentGuess, pastGuesses, isWin, letterStatus])
  
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
      body: JSON.stringify({guess : [...guess.toLowerCase()]})
    })

    const data = await response.json()

    if (!response.ok) {
      setInvalidGuess(true)
      setTimeout(() => setInvalidGuess(false), 300)
      return
    }

    const { gameState: newGameState } = data;

    setGameState(newGameState);
    setPastGuesses(normalizeBoard(newGameState.board));
    setGuessCount(newGameState.guesses.length || 0);
    setIsWin(newGameState.solved || false);
  }



  return (
    <>
      <NavBar logoutUser={logoutUser} openHowToPlay={() => setActiveModal('howToPlay')} openStats={() => setActiveModal('stats')}/>
      <h1>WORDLE</h1>
      {isAuthenticated ? 
      <div> 
        <MainGrid pastGuesses={pastGuesses} guessIndex={guessCount} currentGuess={currentGuess} invalidGuess={invalidGuess}/>
        <Keyboard onKeyPress={editGuess} letterStatus={letterStatus}/>
      </div>:
      
      <div>
        <LoginPage loginUser={loginUser}/>
      </div>}

      <ModalManager activeModal={activeModal} onClose={() => setActiveModal(null)} isWin={isWin} guessCount={guessCount}/>
      
    </>
  )
}

export default App
