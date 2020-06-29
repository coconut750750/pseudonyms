import React from 'react';

import DuetTile from './DuetTile';

import '../Board.css';

function DuetBoard(props) {  
  const getReveals = (r, c) => {
    return props.reveals.filter( rev => rev.r === r && rev.c === c );
  };

  const renderTile = (r, c) => {
    const reveals = getReveals(r, c);
    let color = "";
    let glow = undefined;
    if (props.keycard !== undefined) {
      color = props.keycard.get(r, c)[props.team];
      if (props.otherTeam !== undefined) {
        glow = props.keycard.get(r, c)[props.otherTeam];
      }
    }

    const word = props.board.get(r, c);
    return (
      <DuetTile
        key={word}
        word={word}
        color={color}
        glow={glow}
        reveals={reveals}
        active={props.canReveal}
        reveal={ () => props.revealWord(r, c) }/>
    );
  };

  const renderBoard = () => {
    let board = [];
    for (let r = 0; r < props.board.height; r++) {
      for (let c = 0; c < props.board.width; c++) {
        board.push(renderTile(r, c));
      }
    }
    return board;
  };

  return (
    <div className="board mb-2">
      {renderBoard()}
    </div>
  );
}

export default DuetBoard;