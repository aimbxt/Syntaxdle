import { useState } from 'react';
import PopUp from './PopUp.jsx';

export default function ModalManager({ activeModal, onClose, isWin, guessCount }) {
 
  return (
    <>
      <PopUp isOpen={activeModal === 'howToPlay'} onClose={onClose}>
        <h2>How to Play</h2>
        <p>Guess the word in 6 tries.</p>
      </PopUp>

      <PopUp isOpen={activeModal === 'stats'} onClose={onClose}>
        <h2>Stats</h2>
        <p>Show wins, losses, and streaks here.</p>
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