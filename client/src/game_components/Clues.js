import React, { useState } from 'react';

import UpDownArrow from '../input_components/UpDownArrow';
import Clue from './Clue';

import './Clues.css';

export default function Clues({ clueHistory }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="justify-content-center">
      <div className="all-clues">
        <div className="all-clue-toggle" onClick={ () => setOpen(!open) }>
          <p className="m-0">All Clues ({clueHistory.length}):<UpDownArrow up={open}/></p>
        </div>
        <div className={open ? "open" : "closed"}>
          {clueHistory.slice().reverse().map(c => <Clue clue={c} small/>)}
        </div>
      </div>
    </div>
  );
}