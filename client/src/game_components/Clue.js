import React from 'react';

import './Clue.css';

export default function Clue({clue, tip, small}) {
  const className = `m-0 clue ${clue.team}`;
  const clueText = `${clue.word} : ${clue.count}`;

  if (small) {
    return <p className={className}>{clueText}{tip}</p>;
  } else {
    return <h6 className={className}>{clueText}{tip}</h6>;
  }
}