import React from 'react';

import Tile from '../components/Tile';

function Board(props) {
  const renderRow = (r) => {
    let row = [];
    row.push(<div className="col-1"></div>);
    for (let c = 0; c < props.board.width; c++) {
      let color;
      console.log(props.keycard);
      if (props.keycard !== undefined) {
        color = props.keycard.get(r, c);
      } else {
        color = props.board.getColor(r, c);
      }
      row.push(
        <div className="col-2" style={{ padding: 0 }}>
          <Tile
            word={props.board.get(r, c)}
            color={color}
            revealed={props.board.isRevealed(r, c)}
            isKey={props.me.isKey()}
            reveal={ () => props.socket.emit('revealWord', {r, c}) }/>
        </div>
      );
    }
    row.push(<div className="col-1"></div>);
    return row;
  };

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < props.board.height; i++) {
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