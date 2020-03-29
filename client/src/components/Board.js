import React from 'react';

import Tile from '../components/Tile';

function Board(props) {
  const renderRow = (r) => {
    let row = [];
    row.push(<div className="col-1" key={`${r}-begin`}></div>);
    for (let c = 0; c < props.board.width; c++) {
      let color = props.board.getColor(r, c);
      if (props.keycard !== undefined) {
        color = props.keycard.get(r, c);
      }

      row.push(
        <div className="col-2" style={{ padding: 0 }} key={`${r}-${c}`}>
          <Tile
            word={props.board.get(r, c)}
            color={color}
            revealed={props.board.isRevealed(r, c)}
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
    <div>
      {renderBoard()}
    </div>
  );
}

export default Board;