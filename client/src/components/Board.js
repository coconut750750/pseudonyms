import React from 'react';

import Tile from '../components/Tile';
import PlayerList from '../components/PlayerList';

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

  const renderRow = (r) => {
    let row = [];
    row.push(<div className="col-1" key={`${r}-begin`}></div>);
    for (let c = 0; c < props.board.width; c++) {
      const rev = getRevealed(r, c);
      const isRevealed = rev !== undefined;
      let color = isRevealed ? rev.color : "";
      if (props.keycard !== undefined) {
        color = props.keycard.get(r, c);
      }

      row.push(
        <div className="col-2" style={{ padding: 0 }} key={`${r}-${c}`}>
          <Tile
            word={props.board.get(r, c)}
            color={color}
            revealed={isRevealed}
            isKey={props.isKey}
            active={props.tilesActive}
            reveal={ () => props.revealWord(r, c) }/>
        </div>
      );
    }
    row.push(<div className="col-1" key={`${r}-end`}></div>);
    return row;
  };

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < props.board.height; i++) {
      board.push(<div className="col-12 row" key={i}>{ renderRow(i) }</div>);
    }
    return board;
  };

  return (
    <div className="row">
      <div className="col-2">
        <PlayerList players={getReds()}/>
      </div>
      <div className="col-8">
        {renderBoard()}
      </div>
      <div className="col-2">
        <PlayerList players={getBlues()}/>
      </div>
    </div>
  );
}

export default Board;