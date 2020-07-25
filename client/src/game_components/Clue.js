import React from 'react';

import './Clue.css';

export default function Clue({clue, tip}) {
  return (
    <h6 className={`m-0 clue ${clue.team}`}>{`${clue.word} : ${clue.count}`}{tip}</h6>
  );
}