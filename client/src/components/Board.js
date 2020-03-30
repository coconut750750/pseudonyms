import React from 'react';

import Tile from '../components/Tile';

import './Board.css';

function Board(props) {  
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

    return (
      <Tile
        key={`${r}-${c}`}
        word={props.board.get(r, c)}
        color={color}
        revealed={isRevealed}
        isKey={props.isKey}
        active={props.tilesActive}
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

export default Board;