import React from 'react';

import ClassicTile from './ClassicTile';

import '../Board.css';

function ClassicBoard(props) {  
  const getRevealed = (r, c) => {
    for (var rev of props.reveals) {
      if (rev.r === r && rev.c === c)
        return rev;
    }
    return undefined;
  };

  const renderTile = (r, c) => {
    const rev = getRevealed(r, c);
    const isRevealed = rev !== undefined;
    let color = isRevealed ? rev.color : "";
    if (props.keycard !== undefined) {
      color = props.keycard.get(r, c);
    }

    const word = props.board.get(r, c);
    return (
      <ClassicTile
        key={word}
        word={word}
        color={color}
        revealed={isRevealed}
        showKey={props.showKey}
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

export default ClassicBoard;