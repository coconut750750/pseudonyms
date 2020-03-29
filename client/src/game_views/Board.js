import React from 'react';

import Tile from '../components/Tile';

function Board(props) {
  const renderRow = (r) => {
    let row = [];
    row.push(<div className="col-1"></div>);
    for (var c = 0; c < props.board.width; c++) {
      row.push(
        <div className="col-2" style={{ padding: 0 }}>
          <Tile word={props.board.get(r, c)}/>
        </div>
      );
    }
    row.push(<div className="col-1"></div>);
    return row;
  };

  const renderBoard = () => {
    let board = [];
    for (var i = 0; i < props.board.height; i++) {
      board.push(<div className="col-12 row">{ renderRow(i) }</div>);
    }
    return board;
  };

  return (
    <div>
      <div>
        {renderBoard()}
      </div>
    </div>
  );
}

export default Board;