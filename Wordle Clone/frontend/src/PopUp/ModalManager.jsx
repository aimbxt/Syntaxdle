import { useState } from 'react';
import PopUp from './PopUp.jsx';

export default function ModalManager({ activeModal, onClose, isWin, guessCount, playerStats, statsLoading }) {
  const statNames = {
    games_played: "Games Played",
    games_won: "Games Won",
    current_streak: "Current Streak",
    max_streak: "Max Streak"
  }
 
  return (
    <>
      <PopUp isOpen={activeModal === 'howToPlay'} onClose={onClose}>
        <h2>How to Play</h2>
        <p>Guess the word in 6 tries.</p>
      </PopUp>

      <PopUp isOpen={activeModal === 'stats'} onClose={onClose}>
        <h2>Stats</h2>
        {statsLoading || !playerStats ? (
          <h1>loading...</h1>
        ) : (
          <ul>{Object.entries(playerStats).map(([key, value]) => (
            <li key={key}>
              <p>{statNames[key] || key}: {value}</p>
            </li>
          ))}</ul>
        )}
      </PopUp>

      <PopUp isOpen={activeModal === 'gameOver'} onClose={onClose}>
        {isWin ? (
          <h1>You won! <br /><br /><br /> Guesses: {guessCount}</h1>
        ) : (
          <h1>Try again!</h1>
        )}
      </PopUp>
    </>
  );
}