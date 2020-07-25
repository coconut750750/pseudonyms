import React from 'react';

import Tip from '../components/Tip';

import './Clues.css';

export default function Clues({ clue, clueHistory, guessesLeft, clueActive, canReveal }) {
  return (
    <div className={`justify-content-center clue-container ${clue?.team}`}>
      {clueActive &&
        <h6 className="m-0 clue">{`${clue.word} : ${clue.count}`}
          {canReveal && <Tip help="teamClue"/>}
        </h6>
      }
      {guessesLeft &&
        <h6 className="m-0"><small>{`${guessesLeft} guesses left`}</small>
          <Tip classic help="guessesLeft"/>
        </h6>
      }
    </div>
  );
}