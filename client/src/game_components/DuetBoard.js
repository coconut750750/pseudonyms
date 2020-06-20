import React from 'react';

import DuetTile from './DuetTile';

import './Board.css';

function DuetBoard(props) {  
  const getReveals = (r, c) => {
    return props.reveals.filter( rev => rev.r === r && rev.c === c );
  };

  const renderTile = (r, c) => {
    const reveals = getReveals(r, c);
    let color = "";
    if (props.keycard !== undefined) {
      color = props.keycard.get(r, c);
    }

    return (
      <DuetTile
        key={`${r}-${c}`}
        word={props.board.get(r, c)}
        color={color}
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
    <div>
      <div className="board">
        {renderBoard()}
      </div>
    </div>
  );
}

export default DuetBoard;