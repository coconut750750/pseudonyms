import React from 'react';

import Tile from '../components/Tile';
import PlayerList from '../components/PlayerList';

import './Board.css';

function Board(props) {
  const getReds = () => {
    return props.players.filter(p => p.isRed());
  };

  const getBlues = () => {
    return props.players.filter(p => p.isBlue());
  };
  
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
  }

  const renderRow = (r) => {
    let row = [];
    for (let c = 0; c < props.board.width; c++) {
      row.push(renderTile(r, c));
    }
    return row;
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
    <div className="board">
      {renderBoard()}
    </div>
  );
}

export default Board;